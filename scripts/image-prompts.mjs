// Prompts for the step-by-step exercise illustrations, used by generate-images.mjs.
// Each image is generated from STYLE + its own prompt. The reference image is generated
// first and attached to every other request, so the same person appears in all of them.
// Numbers and captions are added as HTML on the page, never baked into the image.

export const STYLE = `Instructional exercise illustration for a website about gentle Japanese exercise for adults over 60.
Style rules:
- Clean, friendly flat vector illustration with thin dark outlines, like a modern exercise manual. Not photorealistic, not cartoonish.
- The person: a Japanese man in his late 60s, short grey hair, calm expression, light grey t-shirt, navy blue trousers, barefoot.
- Plain white background, no floor texture, no scenery, no shadows except a very soft ellipse under the body.
- Small curved motion arrows in deep emerald green (#047857) show the direction of movement. No other accent colours.
- Figures shown full body, side by side, evenly spaced in equal-width columns, all the same size, on the same baseline.
- Absolutely no text, letters, numbers, labels or logos anywhere in the image.`;

export const REFERENCE = {
  id: 'reference',
  out: 'reference/character-reference.png',
  prompt: `Character reference sheet. Three full-body views of the same person standing relaxed with arms at his sides: front view, side view facing right, and back view.`,
};

const RADIO = 'rajio-taiso-radio-calisthenics';
const ASA = 'asa-no-taiso-morning-stretch';
const SEIZA = 'seiza-sitting-benefits';
const DOIN = 'do-in-self-massage';
const MAKKO = 'makko-ho-stretching';

export const IMAGES = [
  {
    id: 'radio-1-4',
    out: `${RADIO}/radio-taiso-steps-1-4.png`,
    prompt: `Four figures, left to right, standing facing the viewer, feet shoulder-width apart:
1. Both arms raised forward and up overhead (arm circles with deep breathing), arrow showing the arms sweeping up in a wide circle.
2. Arms swinging back with shoulder blades squeezed, shown slightly from the side, arrow showing the forward-and-back swing.
3. Arms extended out to the sides at shoulder height, small circular arrows at each hand (small shoulder circles).
4. Shown from the side, facing right: knees clearly bent in a small squat, both arms swung far back behind the hips with straight elbows and hands pointing backward and up, curved arrow showing the arms swinging from the front to behind the body.`,
  },
  {
    id: 'radio-5-8',
    out: `${RADIO}/radio-taiso-steps-5-8.png`,
    prompt: `Four figures, left to right:
5. Side bend to the right: right hand on hip, left arm reaching up and over the head, arrow along the arc of the left arm.
6. Forward bend from the hips with arms hanging toward the floor (hands not touching the floor), arrow pointing down.
7. Hands on hips, upper body twisted to the right while the hips face forward, curved arrow around the waist.
8. Standing on the left leg, right arm raised forward and up while the left leg lifts slightly forward off the floor, arrows on the arm and leg.`,
  },
  {
    id: 'radio-9-13',
    out: `${RADIO}/radio-taiso-steps-9-13.png`,
    prompt: `Five figures, left to right:
9. Side view, one hand resting on the back of a simple wooden chair, the outer leg swinging forward, arrow showing the forward-and-back swing.
10. Feet together, rising up onto the toes, small upward arrow under the heels.
11. Stepping the right foot out to the side while raising both arms overhead (low-impact jumping jack, both feet stay on the floor), arrows on the arms and foot.
12. Stepping to the right with both arms swinging across the body to the right, arrow showing the swing.
13. Feet together, both arms raised slowly overhead, eyes closed, calm deep breath, gentle arrow upward along the arms.`,
  },
  {
    id: 'asa-phase-1',
    out: `${ASA}/asa-no-taiso-phase-1.png`,
    prompt: `Three figures, left to right, standing, feet hip-width apart, knees soft:
1. Palms pressed together at chest height (gassho), eyes closed.
2. Palms still pressed together, shoulders lifted up toward the ears, small circular arrow at each shoulder.
3. Head tilted gently so the right ear moves toward the right shoulder, arrow showing the tilt.`,
  },
  {
    id: 'asa-phase-2',
    out: `${ASA}/asa-no-taiso-phase-2.png`,
    prompt: `Four figures, left to right:
4. Both arms reaching straight up toward the ceiling, rising onto the toes, arrow pointing up.
5. Side bend to the right, right hand sliding down the right thigh, left arm relaxed, arrow along the left side of the body.
6. Arms extended forward at shoulder height, torso rotated to the right as one unit, hips facing forward, curved arrow.
7. Hinged forward at the hips, arms dangling loosely toward the floor, knees soft, arrow pointing down.`,
  },
  {
    id: 'asa-phase-3',
    out: `${ASA}/asa-no-taiso-phase-3.png`,
    prompt: `Three figures, each with one hand lightly on the back of a simple wooden chair for balance, shown from the side:
8. Lifting one knee gently forward (leg awakening), arrow at the knee.
9. Rising up onto the toes (heel raise), small upward arrow under the heels.
10. Standing on one leg with the other foot slightly off the floor, circular arrow around the raised ankle (ankle circles).`,
  },
  {
    id: 'asa-phase-4-5',
    out: `${ASA}/asa-no-taiso-phase-4-5.png`,
    prompt: `Four figures, left to right:
11. One hand on a chair, gentle lunge stance stretching the front of the back hip (hip flexor stretch), arrow at the hip.
12. One hand on a chair, outer leg swinging forward and back, arrow showing the swing.
13. Standing relaxed, arms loose, whole body gently shaking, short wavy motion lines at the hands.
14. Standing tall, hands resting over the heart, eyes closed, calm smile (gratitude breathing).`,
  },
  {
    id: 'seiza-steps',
    out: `${SEIZA}/seiza-getting-into-position-steps.png`,
    prompt: `Four figures, all shown from the side, on a thin flat mat:
1. On hands and knees on the mat.
2. Kneeling upright with knees together, tops of the feet flat on the mat, big toes touching behind.
3. Lowering the buttocks back onto the heels, hands on the thighs, arrow pointing down.
4. Sitting tall in seiza on the heels, spine long, hands resting on the upper thighs, shoulders relaxed.`,
  },
  {
    id: 'doin-routine',
    out: `${DOIN}/do-in-morning-routine-steps.png`,
    prompt: `Five figures, all sitting upright on the front edge of a simple wooden chair, facing the viewer, upper body slightly larger in frame so the hands are clearly visible:
1. Lightly tapping the forehead and cheeks with the fingertips of both hands.
2. Both hands on the scalp, fingertips making small circles, small circular arrows.
3. Right hand tapping down the inside of the extended left arm, arrow along the arm.
4. Both palms flat on the lower belly, circular arrow showing a slow clockwise circle.
5. Left foot resting on the right knee, both thumbs pressing the sole of the foot.`,
  },
  {
    id: 'makko-overview',
    out: `${MAKKO}/makko-ho-four-poses-overview.png`,
    prompt: `Four figures, all on the floor, shown from the side:
1. Seated forward fold: legs straight out in front, feet flexed, hinging forward from the hips with hands resting on the shins, arrow pointing forward.
2. Straddle stretch: legs spread wide in a V shape, feet flexed, folding gently forward with hands on the floor in front.
3. Cross-legged side stretch: sitting cross-legged, right hand on the floor beside the hip, left arm reaching up and over the head to the right, arrow along the arc of the arm.
4. Kneeling back bend: kneeling upright with knees hip-width apart, tops of the feet on the floor, hands supporting the lower back, chest lifted in a small gentle backward arch (not a deep bend), head in line with the spine.`,
  },
];
