export function buildPrompt(params) {

    const {
        numberOfWorkouts,
        level,
        focusMusclesVsRest,
        location,
        focusMuscles,
        adaptations,
        workoutLength,
        intensity
    } = params

    const levelToText = {
        1: "First-Time",
        2: "Beginner",
        3: "Intermediate",
        4: "Advanced",
        5: "Professional"
    }

    const levelToOverloadValue = {
        1: 1,
        2: 3,
        3: 5,
        4: 6,
        5: 7
    }

    const levelToTotalWorkoutSets = {
        1: [5, 10],
        2: [12, 20],
        3: [17, 25],
        4: [22, 30],
        5: [27, 35]
    }

    const levelToFocusMusclesSets = {
        1: [3, 8],
        2: [7, 13],
        3: [10, 18],
        4: [15, 23],
        5: [20, 28]
    }


    const workoutTypesToInclude = location
    const workoutTypesToExclude = ["gym", "outdoor", "studio", "home"].filter(wt => !location.includes(wt))
    const workoutTypeDescription = {
        gym: "Gym: Ensure that the Gym exercises include mostly weights and machines (unless its a core exercise), Avoid exercises solely reliant on body weight unless they are core exercises",
        outdoor: "Outdoor: Outdoor exercises should be bodyWeight only - meaning no weights or machines are needed, but can include equipment like a pull-up bar and such.",
        studio: "Studio: Studio exercises should be more functional and less bodybuilding oriented but can still include weights and studio equipment.",
        home: "Home: Home exercises should be bodyWeight only - meaning no equipment/weight is needed."
    }


    return `
    Act as an experienced fitness trainer. 
    You need to build a training plan for a client.

    The level of your client, (the person you are building the training plan for) is ${levelToText[level]} (${level} out of 5).

${focusMuscles.length === 0 ? "" : `The muscles to focus on the plan should be: ${focusMuscles.join(", ")}.
    The focused muscles above should be targeted in around ${focusMusclesVsRest}% of the exercises.
    The rest of the exercises should be as diverse as possible targeting Legs, upper body and core.
    Each focus muscle should be targeted for from ${levelToFocusMusclesSets[level].join(" to ")} weekly sets.
    Each focus muscle should be targeted in around 2-4 exercises.
    `}


There should be ${numberOfWorkouts} weekly exercises. 
The duration of each workout should be around ${workoutLength} minutes.
The intensity of the workout should be around ${intensity}.
for each workout the total amount of sets in the workout should be from ${levelToTotalWorkoutSets[level].join(" to ")} .

${workoutTypesToInclude.length === 1 ? `The exercises should be suitable only for: ${workoutTypesToInclude.join("")}.` : ""}
${workoutTypesToExclude.length > 0 ? `The exercises should not be suitable for: ${workoutTypesToExclude.join(", ")}.` : ""}
${workoutTypesToInclude.length > 1 ? `
    The exercises should be a mix of exercises suitable for: ${workoutTypesToInclude.join(", ")}.
` : ""}
Clarifications about each training location:
${workoutTypesToInclude.map(wt => workoutTypeDescription[wt]).join("\n")}

The weekly progressive overload should be around ${levelToOverloadValue[level]}% per week.

${adaptations.length > 0 ? `The desired adaptations from the training plan are: ${adaptations.join(", ")}.` : ''}


The result should be a JSON object in this format:
{

    exercises: [<Array of: {
    "name": string (the name of the exercise),
        "overloadType": < "weight" / "reps" / "sets" / "duration" > (the type of progressive overload("weight", "reps", "sets", "duration")),
        "overloadValue": number(the percentage of weekly progressive overload in %),
        "numberOfReps": number(number of reps),
        "weight": number(weight in kg),
        "duration": number(duration in seconds - only for static exercises(e.g plank, wall sit, etc...)),
} >],

workouts: [ <Array of: {
        name: <the name of the workout>
        workoutExercises: [ <Array of: { 
            "name": <the name of the exercise>, 
            "sets": <the number of sets for this exercises in this workout> 
        }]
    } >],
    
    newExercises: [ <Array of: {
        "name": string // the name of the new exercise
        "primaryMuscle": string, // primary muscle of this exercise - use muscles from the list below
        "secondaryMuscles": Array<string>, // an Array of secondary muscles of this exercise
        "pullPush":("Pull"/"Push"/null), //is it pull or push exercise
        "bodyWeight": boolean, // is the exercise a body weight only exercise
        "category": <"Core"/"Upper body"/"Legs">, //the category of the exercise ("Core", "Upper body", "Legs")
        "static": boolean // is the exercises a static exercises - meaning its holding in one position exercise like plank, without reps
    }>]
}

Restrictions for the exercises values: Only if the exercise is a body weight exercise the weight field should be 0.;

The total number of sets of each workout should be around the same (doesn't have to be exact but preferably close).

The newExercises field includes the exercises you chose that are not part of the list of exercises listed below.
You can either choose exercises from a predefined list of exercises given below, or add your own exercises. If you wish to add your own exercises please also add them in a new field called “newExercises” - which is an array of exercises information.
The predefined exercises is this:
[
    "Wide Push-ups",
    "Push-ups",
    "Squats",
    "Lunges",
    "Deadlifts",
    "Bench Press",
    "Pull-ups",
    "Sit-ups",
    "Mountain Climbers",
    "Bicep Curls",
    "Shoulder Press",
    "Shoulder Side raise",
    "Shoulder Front raise",
    "Tricep Dips",
    "Jump Squats",
    "Kettlebell Swings",
    "Box Jumps",
    "Wall Sit",
    "ATG Split Squats",
    "Hip Extention",
    "Muscle Up",
    "Dips",
    "Plank",
    "Side Plank",
    "Lat Pull-downs",
    "Chin-ups",
    "Leg Press",
    "Single Leg Press",
    "Cable Chest Fly",
    "Seated Row",
    "Leg Curls",
    "Leg Extensions",
    "Face Pulls",
    "Calf Raises",
    "Diamond Push-ups",
    "Pistol Squats",
    "Handstand Push-ups",
    "Glute Bridge",
    "Inverted Row",
    "L-Sit",
    "Archer Push-ups",
    "Single-leg Deadlift",
    "Nordic Hamstring Curl",
    "Bulgarian split squats",
    "Single leg Squats",
    "Thrusters",
    "Hip Thrust",
    "Romanian Deadlift",
    "Incline Bench Press",
    "Farmer Carry",
    "Dragon Flies"
]
Like I said, if you include exercises that are not in in this list please also add them in a new field called newExercises - which is an array of exercises information (the type of this object is described above).

IMPORTANT:
Make sure that only exercises that are listed in the exercises array are included in the workoutExercises array.
DO NOT INCLUDE anything beside the JSON object since it should be copied and pasted into an application
  `
}