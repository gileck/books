const dotenv = require('dotenv');
dotenv.config({
    path: '.env.development.local'
});
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const { put, head } = require('@vercel/blob');

const staticExercisesList = [{
    "name": "Wide Push-ups",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "wide_hand_push_up.jpg"
},
{
    "name": "Push-ups",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "clap_push_up.jpg"
},
{
    "name": "Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "kettlebell_goblet_squat_mobility.jpg"
},
{
    "name": "Lunges",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_lunge.jpg"
},
{
    "name": "Deadlifts",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_clean_deadlift.jpg"
},
{
    "name": "Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "bench_press.jpg"
},
{
    "name": "Pull-ups",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "archer_pull_up.jpg"
},
{
    "name": "Sit-ups",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "janda_sit_up.jpg"
},
{
    "name": "Mountain Climbers",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Shoulders"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "mountain_climber.jpg"
},
{
    "name": "Bicep Curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_drag_bicep_curl.jpg"
},
{
    "name": "Shoulder Press",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_alternate_shoulder_press.jpg"
},
{
    "name": "Shoulder Side raise",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_lateral_raise.jpg"
},
{
    "name": "Shoulder Front raise",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_standing_front_raise_above_head.jpg"
},
{
    "name": "Tricep Dips",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "chest_dip.jpg"
},
{
    "name": "Jump Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "double_jump_squat.jpg"
},
{
    "name": "Kettlebell Swings",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "kettlebell_swing.jpg"
},
{
    "name": "Box Jumps",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "jump_on_fit-box.jpg"
},
{
    "name": "Wall Sit",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes"
    ],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_wall_squat.jpg"
},
{
    "name": "ATG Split Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "split_squats.jpg"
},
{
    "name": "Hip Extention",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "cable_standing_hip_extension.jpg"
},
{
    "name": "Muscle Up",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Triceps",
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "archer_pull_up.jpg"
},
{
    "name": "Dips",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "elbow_dips.jpg"
},
{
    "name": "Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "static": true,
    "image": "plank_jack.jpg"
},
{
    "name": "Side Plank",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "static": true,
    "image": "side_plank_leg_lift.jpg"
},
{
    "name": "Lat Pull-downs",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_wide-grip_lat_pulldown.jpg"
},
{
    "name": "Chin-ups",
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "chin-up.jpg"
},
{
    "name": "Leg Press",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_leg_press.jpg"
},
{
    "name": "Single Leg Press",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_horizontal_one_leg_press.jpg"
},
{
    "name": "Cable Chest Fly",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_standing_fly.jpg"
},
{
    "name": "Seated Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_low_seated_row.jpg"
},
{
    "name": "Leg Curls",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_leg_curl.jpg"
},
{
    "name": "Leg Extensions",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_one_leg_extension.jpg"
},
{
    "name": "Face Pulls",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_standing_supinated_face_pull_(with_rope).jpg"
},
{
    "name": "Calf Raises",
    "primaryMuscle": "Calves",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "standing_calf_raise.jpg"
},
{
    "name": "Diamond Push-ups",
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [
        "Chest",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "diamond_push_up.jpg"
},
{
    "name": "Pistol Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "kettlebell_pistol_squat.jpg"
},
{
    "name": "Handstand Push-ups",
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [
        "Triceps",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "handstand_push-up.jpg"
},
{
    "name": "Glute Bridge",
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "glute_bridge_two_legs_on_floor.jpg"
},
{
    "name": "Inverted Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps",
        "Shoulders"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "inverted_row_with_bed_sheet.jpg"
},
{
    "name": "L-Sit",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Hip Flexors"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "l-sit_on_floor.jpg"
},
{
    "name": "Archer Push-ups",
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Upper body",
    "image": "incline_close-grip_push-up.jpg"
},
{
    "name": "Single-leg Deadlift",
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
        "Glutes",
        "Core"
    ],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Legs",
    "image": "kettlebell_kickstand_one_leg_deadlift.jpg"
},
{
    "name": "Nordic Hamstring Curl",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": true,
    "category": "Legs",
    "image": "bodyweight_lying_legs_curl_(male).jpg"
},
{
    "name": "Bulgarian split squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "smith_split_squat.jpg"
},
{
    "name": "Single leg Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Calves"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "single_leg_squat.jpg"
},
{
    "name": "Thrusters",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Shoulders",
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_swing.jpg"
},
{
    "name": "Hip Thrust",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings",
        "Core"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_staggered_stance_hip_thrust.jpg"
},
{
    "name": "Romanian Deadlift",
    "gym": true,
    "primaryMuscle": "Hamstrings",
    "secondaryMuscles": [
        "Glutes",
        "Back"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Legs",
    "image": "barbell_romanian_deadlift.jpg"
},
{
    "name": "Incline Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "incline_bench_press.jpg"
},
{
    "name": "Farmer Carry",
    "gym": true,
    "primaryMuscle": "Forearms",
    "secondaryMuscles": [
        "Core",
        "Shoulders"
    ],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Core",
    "image": "kettlebell_farmers_carry.jpg"
},
{
    "name": "Dragon Flies",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "weighted_muscle_up.jpg"
},
{
    "name": "Cable biceps curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_curl.jpg"
},
{
    "name": "Russian Twists",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Obliques"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "russian_twist.jpg"
},
{
    "name": "Hammer Curls",
    "gym": true,
    "primaryMuscle": "Biceps",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_seated_alternate_shoulder.jpg"
},
{
    "name": "Step-ups",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Glutes",
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "jump_step-up.jpg"
},
{
    "name": "Reverse Lunges",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": true,
    "category": "Legs",
    "image": "warming-up_in_lunge.jpg"
},
{
    "name": "Flutter Kicks",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Hip Flexors"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "prisoner_half_sit-up.jpg"
},
{
    "name": "Chest Press Machine",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "lever_incline_chest_press.jpg"
},
{
    "name": "Lat Pulldown Machine",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_reverse_grip_pulldown.jpg"
},
{
    "name": "Side Crunch",
    "primaryMuscle": "Core",
    "secondaryMuscles": [
        "Obliques"
    ],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "bottle_weighted_side_bend_(female).jpg"
},
{
    "name": "Running",
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Cardio",
    "image": "stationary_bike_run.jpg"
},
{
    "name": "Crunches",
    "primaryMuscle": "Core",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": true,
    "category": "Core",
    "image": "crunch_floor.jpg"
},
{
    "name": "Rowing Machine",
    "gym": true,
    "primaryMuscle": "Cardio",
    "secondaryMuscles": [],
    "pullPush": null,
    "bodyWeight": false,
    "category": "Cardio",
    "image": "cable_seated_row_with_v_bar.jpg"
},
{
    "name": "Inner Thigh Extensions",
    "primaryMuscle": "Thighs",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "lever_seated_hip_adduction.jpg"
},
{
    "name": "Cable Kickbacks",
    "gym": true,
    "primaryMuscle": "Glutes",
    "secondaryMuscles": [
        "Hamstrings"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "cable_kneeling_glute_kickback_(female).jpg"
},
{
    "name": "Goblet Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "dumbbell_goblet_squat.jpg"
},
{
    "name": "Front Squats",
    "gym": true,
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "smith_front_squat.jpg"
},
{
    "name": "Sumo Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes",
        "Adductors"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "sitting_sumo_right_twist_stretch.jpg"
},
{
    "name": "Cossack Squats",
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
        "Hamstrings",
        "Glutes",
        "Adductors"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Legs",
    "image": "smith_split_squat.jpg"
},
{
    "name": "Dumbbell Bench Press",
    "gym": true,
    "primaryMuscle": "Chest",
    "secondaryMuscles": [
        "Triceps",
        "Shoulders"
    ],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_one_arm_bench_fly.jpg"
},
{
    "name": "Lateral Raises",
    "gym": true,
    "primaryMuscle": "Shoulders",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "dumbbell_partials_lateral_raise.jpg"
},
{
    "name": "Cable Triceps Pushdowns",
    "gym": true,
    "primaryMuscle": "Triceps",
    "secondaryMuscles": [],
    "pullPush": "Push",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "cable_triceps_pushdown.jpg"
},
{
    "name": "Back Extension",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body",
    "image": "lever_back_extension.jpg"
},
{
    "name": "Bent Over Row",
    "gym": true,
    "primaryMuscle": "Back",
    "secondaryMuscles": [
        "Biceps"
    ],
    "pullPush": "Pull",
    "bodyWeight": false,
    "category": "Upper body"
}
]
async function start() {
    const mongoClient = await client.connect();
    const db = await mongoClient.db()
    // const response = await db.collection('exercises').insertMany(staticExercisesList)
    // console.log({ response })
    for (const exercise of staticExercisesList) {
        const { name } = exercise
        console.log({ name })
        // const imageUrl = `https://storage.googleapis.com/workout-plan-generator/${image}`


        // const exists = await head(imageUrl)
        // console.log({ exists })
        // if (exists) {
        //     console.log('exists')
        //     continue
        // }

        const item = await db.collection('exercises').findOne({ name })
        if (item.image.includes("https")) {
            console.log('exists', item.name, item.image)
            continue
        }
        const imageUrl = `${name.toLowerCase().replace(/ /g, '_')}.jpg`
        const toPath = path.resolve(__dirname, `../../public/images/${imageUrl}`)
        const data = fs.readFileSync(toPath)
        const blob = await put(imageUrl, data, {
            access: 'public',
        });

        const response = await db.collection('exercises').updateOne({ name }, { $set: { image: blob.url } })
        console.log(name, response.modifiedCount, blob.url)
        // try {
        //     if (fs.existsSync(toPath)) {

        //         continue
        //     }
        //     if (!fs.existsSync(fromPath)) {
        //         console.log({ fromPath })
        //         continue
        //     }
        //     if (!fs.existsSync(toPath)) {
        //         fs.renameSync(fromPath, toPath)
        //     }
        // } catch (error) {
        //     console.log({ error })
        // }

    }
}
start()