import { getResponseFromGpt } from "@/ai/ai";
import { getUser } from "../userApi";
import { getDB } from "../db";
import { sendLog } from '@/telegramBot/bot.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    const { text, trainingPlanId } = req.body;
    const user = await getUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const db = await getDB();

    const trainingPlan = await db.collection('trainingPlans').findOne({ id: trainingPlanId });

    const planWithoutWeeks = {
        ...trainingPlan,
        plan: {
            ...trainingPlan.plan,
            exercises: trainingPlan.plan.exercises.map(exercise => {
                const { weeks, ...rest } = exercise;
                return rest;
            }),
            workouts: trainingPlan.plan.workouts.map(workout => {
                return {
                    ...workout,
                    exercises: workout.exercises.map(exercise => {
                        const { weeks, ...rest } = exercise;
                        return rest;
                    })
                }
            }),

        }
    }


    const prompt = `

    you are an experienced fitness trainer.
    a client has come to you for help with their fitness plan.
    They already have an existing training plan. 
    They want to change their training plan.

    this is their current training plan:

    ${JSON.stringify(planWithoutWeeks)}

    this is what they want to change in their current:
    
    ${text}
    
    ------------------

    The Exercise structure is:
    { overloadValue: number, overloadType: string, name: string, numberOfReps: number, weight: number, weeklySets: number }
    The Workout structure is:
    { name: string, exercises: Array<Exercise & {sets: number}> }
    
    return a JSON object with 2 keys:
    - message: a message to the client explaining the change you are about to make and prompting them to confirm. list each change you are about to make in a seperate bullet point. be specific about the changes you are about to make. if you are adding a new exercise, specify it, and its details (name, sets, reps, weight, etc) and specify the workout it is added to.

    - changes: an array of changes you made to the training plan. Each change should be an object with the following keys:
        * action: the action of change you made. This can be one of the following (only the function name, the params are in the params field): 
            
            addEmptyWorkout({workoutName}): a new empty workout to the training plan.
            editExercise({exercise: Exercise}): edit an existing exercise in the training plan.
            addExercise({exercise: Exercise}): add a new single exercise to the training plan.
            addMultipleExercises({exercises: Array<Exercise>}): add multiple exercises to the training plan. 
            deleteWorkout({workoutId: string}): delete an existing workout from the training plan.
            deleteExercise({exerciseId: string}): delete an existing exercise from the training plan. take the exerciseId from the id field of the exercise object.
            editWorkout({workout: Workout}): edit an existing workout in the training plan.
            addExerciseToWorkout({ workoutName: string, exerciseName: string, sets: number }): add an exercise to an existing workout. use it only when there is already a workout in the plan.
            deleteExerciseFromWorkout({workoutId: string, exerciseName: string}): delete an exercise from an existing workout.
            changeExerciseSetsInWorkout({workoutId: string, exerciseName: string, sets: number}): change the sets of an exercise in an existing workout.


        * params: an object of key-value pairs that the action needs to work. The params object will be the parameter of the action function. it should be a valid object for the action function.
            For example:
            action: addExercise
            params:  {exercise: { "id": "shoulder_exercise_1", "overloadValue": 5, "overloadType": "weight", "name": "Front Raise", "numberOfReps": 10, "weight": 12, "weeklySets": 5 }}
    
    -------------------------------------
    notes:
    * each action should be an atomic change to the training plan.
    * if you have multiple changes to make, make sure to return them in the changes array.
    * params should always be an object.
    * when you edit an exercise, no need to update it in all the workouts, it will be done automatically.
    * only when you update the exercise sets you should update it in all the workouts (use changeExerciseSetsInWorkout).
    * if you add a new exercise, make sure to add it to a workout too (using addExerciseToWorkout, and if there is no workout in the plan, create a new workout, then use addExerciseToWorkout).
    * if you delete an exercise, make sure to delete it from all the workouts (use deleteExerciseFromWorkout).
    * if you delete a workout, make sure to delete the exercises from the workout.
    * if you add a new single exercise change, you can add it to an existing workout (use addExerciseToWorkout).
    * if you add multiple new exercises, you can add it to an existing workout or create a new one (depends on the new exercises).
    * if there are no workouts in the plan, create a new one.
    * dont create an empty workout and then add exercises to it, just create the workout with the exercises.
    `;

    const { result, apiPrice, modelToUse, usage, duration } = await getResponseFromGpt({
        system: '',
        inputText: prompt,
        isJSON: true,
        model: '3'
    })



    res.status(200).json({ result, apiPrice });

    await sendLog(`
        AI: EditPlanAI
        User: ${user.username}
        Question: ${text}
        Result: ${JSON.stringify(result || '').length} characters
        price: ${apiPrice}
        model: ${modelToUse}
        tokens: ${usage.total_tokens}
        duration: ${duration}
        date: ${new Date().toLocaleString()}
    `);

    await db.collection('ai-api-logs').insertOne({
        type: 'EditPlanAI',
        user: user.username,
        input: text,
        result,
        price: apiPrice,
        model: modelToUse,
        tokens: usage.total_tokens,
        date: new Date(),
        duration
    });

}