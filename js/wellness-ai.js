/**
 * NaturalHealth PWA - AI Wellness Recommendations
 * Provides SPECIFIC, contextual holistic suggestions based on user's exact concern
 * Each recommendation includes WHY it helps the specific condition
 */

const WellnessAI = (function() {
  
  // Comprehensive condition database with specific recommendations
  const conditionsDB = {
    // SLEEP ISSUES
    'cant_sleep': {
      patterns: ['cant sleep', "can't sleep", 'cannot sleep', 'trouble sleeping', 'hard to sleep', 'difficulty sleeping', 'struggling to fall asleep', 'falling asleep', 'fall asleep', 'takes forever to sleep', 'lying awake'],
      title: 'Difficulty Falling Asleep',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Drink chamomile tea 30-60 minutes before bed',
          why: 'Chamomile contains apigenin, a compound that binds to GABA receptors in the brain, producing a calming effect similar to anti-anxiety medications but naturally. Studies show it reduces the time it takes to fall asleep by an average of 15 minutes.'
        },
        {
          pillar: 'nutrition',
          tip: 'Avoid caffeine after 2 PM',
          why: 'Caffeine has a half-life of 5-6 hours, meaning half of it is still in your system 6 hours later. Consuming it late disrupts adenosine (your sleep hormone) and delays your natural sleep onset by up to 40 minutes.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat magnesium-rich foods: almonds, bananas, dark chocolate',
          why: 'Magnesium regulates melatonin production and activates the parasympathetic nervous system (rest-and-digest mode). Research shows magnesium deficiency is directly linked to insomnia and restless sleep.'
        },
        {
          pillar: 'sleep',
          tip: 'Keep your bedroom at 65-68°F (18-20°C)',
          why: 'Your core body temperature needs to drop 2-3°F to initiate sleep. A cool room facilitates this natural temperature drop, signaling your body it\'s time to sleep. Warm rooms fight against this process.'
        },
        {
          pillar: 'sleep',
          tip: 'Use the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s',
          why: 'This specific ratio activates your vagus nerve and parasympathetic system. The extended exhale triggers a relaxation response, slowing heart rate by up to 20% and calming racing thoughts within 2-3 minutes.'
        },
        {
          pillar: 'movement',
          tip: 'Do gentle yoga or stretching 1-2 hours before bed',
          why: 'Gentle stretching releases physical tension stored in muscles and activates the parasympathetic nervous system. It also helps transition your body from "doing mode" to "resting mode."'
        },
        {
          pillar: 'mind',
          tip: 'Write down tomorrow\'s tasks and worries before bed',
          why: 'Racing thoughts often prevent sleep because your brain is trying to "hold" information. Writing externalizes these thoughts, giving your brain "permission" to let go. Studies show this reduces sleep onset time by 9 minutes on average.'
        },
        {
          pillar: 'mind',
          tip: 'Try a body scan meditation while lying in bed',
          why: 'Systematically focusing attention on each body part shifts your brain from "thinking mode" to "sensing mode," breaking the cycle of anxious thoughts and promoting progressive relaxation.'
        }
      ]
    },

    'insomnia': {
      patterns: ['insomnia', 'awake at night', 'wake up at night', 'waking up', 'cant stay asleep', "can't stay asleep", 'middle of night', 'keep waking', '3am', '4am'],
      title: 'Insomnia & Night Waking',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Try tart cherry juice (8oz) 1-2 hours before bed',
          why: 'Tart cherries are one of the few natural food sources of melatonin. Studies show drinking tart cherry juice increases sleep time by 84 minutes and improves sleep efficiency by 5-6%.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat a small protein-carb snack if you wake hungry',
          why: 'Blood sugar drops during the night can trigger cortisol release, waking you up (especially between 2-4am). A small snack like banana with almond butter stabilizes blood sugar throughout the night.'
        },
        {
          pillar: 'sleep',
          tip: 'If awake for 20+ minutes, get up and do something calming',
          why: 'Staying in bed while frustrated creates a negative psychological association between your bed and wakefulness. Leaving briefly and returning only when sleepy retrains your brain to associate bed with sleep.'
        },
        {
          pillar: 'sleep',
          tip: 'Try valerian root supplement (300-600mg before bed)',
          why: 'Valerian increases GABA levels in the brain - the same calming neurotransmitter targeted by sleep medications. It reduces time to fall asleep and improves sleep quality without morning grogginess.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise in the morning or early afternoon, not evening',
          why: 'Exercise raises core body temperature and cortisol levels. Your body needs 4-6 hours to cool down and for cortisol to drop to sleepy levels. Morning exercise also helps regulate your circadian rhythm.'
        },
        {
          pillar: 'mind',
          tip: 'Practice "cognitive shuffling" - think of random unrelated images',
          why: 'This technique (imagining random objects: apple, car, tree, beach...) prevents your brain from constructing coherent worrying narratives, mimicking the random thoughts that occur naturally as you fall asleep.'
        }
      ]
    },

    // DIGESTIVE ISSUES
    'diarrhea': {
      patterns: ['diarrhea', 'loose stool', 'loose stools', 'runny stomach', 'upset stomach', 'watery stool', 'bathroom a lot', 'frequent bowel'],
      title: 'Diarrhea & Loose Stools',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Follow the BRAT diet: Bananas, Rice, Applesauce, Toast',
          why: 'These foods are low in fiber and have binding properties that help firm up stools. They\'re bland and unlikely to irritate an inflamed digestive tract. Bananas specifically replace potassium lost through diarrhea.'
        },
        {
          pillar: 'nutrition',
          tip: 'Drink bone broth or clear broths throughout the day',
          why: 'Diarrhea causes significant fluid and electrolyte loss. Bone broth provides sodium, potassium, and glycine (an amino acid that helps heal the gut lining), while being easy to digest and soothing.'
        },
        {
          pillar: 'nutrition',
          tip: 'Avoid dairy, caffeine, alcohol, and fatty foods temporarily',
          why: 'These foods stimulate intestinal contractions and can significantly worsen diarrhea. Dairy is particularly problematic as diarrhea temporarily reduces lactase enzyme production, causing lactose intolerance.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take Saccharomyces boulardii probiotic supplement',
          why: 'S. boulardii is a beneficial yeast specifically studied for diarrhea. It survives stomach acid and directly fights harmful bacteria. Studies show it reduces diarrhea duration by approximately 1 day.'
        },
        {
          pillar: 'sleep',
          tip: 'Rest as much as possible while recovering',
          why: 'Your immune system works most effectively during rest. Sleep allows your body to redirect energy from daily activities to healing the gut lining and fighting any underlying infection.'
        },
        {
          pillar: 'movement',
          tip: 'Avoid intense exercise until symptoms resolve',
          why: 'Exercise diverts blood flow away from the digestive system to your muscles, which can worsen symptoms and dehydration. Light walking is okay, but intense exercise should wait until recovery.'
        },
        {
          pillar: 'mind',
          tip: 'Practice slow, deep belly breathing',
          why: 'Stress activates the sympathetic nervous system, which shuts down digestion. Deep diaphragmatic breathing activates the parasympathetic system (rest-and-digest), allowing your gut to heal and function normally.'
        }
      ]
    },

    'constipation': {
      patterns: ['constipation', 'constipated', 'cant poop', "can't poop", 'hard stool', 'difficulty pooping', 'not regular', 'bowel movement', 'haven\'t pooped', 'blocked up'],
      title: 'Constipation',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Drink warm water with lemon first thing in the morning',
          why: 'Warm water stimulates peristalsis (wave-like intestinal contractions) and triggers the gastrocolic reflex. Lemon\'s citric acid stimulates digestive juices and bile production, promoting bowel movement.'
        },
        {
          pillar: 'nutrition',
          tip: 'Increase fiber gradually: chia seeds, flaxseed, prunes',
          why: 'Fiber adds bulk to stool and helps it retain water, making it softer and easier to pass. Prunes also contain sorbitol, a natural laxative. Important: add fiber slowly to avoid bloating.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take magnesium citrate (200-400mg) before bed',
          why: 'Magnesium draws water into the intestines through osmosis, softening stool. The citrate form is best absorbed and also relaxes intestinal smooth muscles, allowing easier passage.'
        },
        {
          pillar: 'nutrition',
          tip: 'Drink at least 8 glasses of water daily',
          why: 'Without adequate water, fiber actually makes constipation WORSE by creating hard, bulky stool. Water is essential for fiber to do its job of softening and moving stool through.'
        },
        {
          pillar: 'movement',
          tip: 'Walk for 15-30 minutes daily',
          why: 'Walking physically massages the intestines and stimulates the natural wave-like contractions that move stool through your system. Studies show regular walkers have 40% less constipation.'
        },
        {
          pillar: 'movement',
          tip: 'Use a squatting position or toilet stool',
          why: 'Squatting straightens the anorectal angle from 100° to 126°, allowing for easier, more complete evacuation. A small stool that elevates your feet mimics this natural position.'
        },
        {
          pillar: 'mind',
          tip: 'Establish a regular bathroom routine, especially after breakfast',
          why: 'Ignoring the urge trains your rectum to stop sending signals over time. Going at the same time daily (especially after breakfast when the gastrocolic reflex is strongest) retrains this natural response.'
        }
      ]
    },

    'bloating': {
      patterns: ['bloated', 'bloating', 'gassy', 'gas', 'stomach bloat', 'belly bloat', 'feeling full', 'distended', 'puffy stomach'],
      title: 'Bloating & Gas',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Drink peppermint or ginger tea after meals',
          why: 'Peppermint relaxes the smooth muscles of the digestive tract, allowing trapped gas to pass. Ginger stimulates digestive enzymes and speeds gastric emptying, reducing the time food sits and ferments.'
        },
        {
          pillar: 'nutrition',
          tip: 'Chew food thoroughly - aim for 20-30 chews per bite',
          why: 'Digestion begins in the mouth with enzymes in saliva. Poorly chewed food reaches the gut in large pieces, requiring more bacterial fermentation to break down - and fermentation produces gas.'
        },
        {
          pillar: 'nutrition',
          tip: 'Identify trigger foods: common culprits are beans, dairy, onions, garlic, wheat',
          why: 'These foods contain FODMAPs - fermentable carbohydrates that gut bacteria feast on, producing gas as a byproduct. Keeping a food diary helps identify your personal triggers.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take digestive enzyme supplements with meals',
          why: 'Enzyme supplements help break down food before bacteria can ferment it. Specific enzymes like lactase (for dairy) or alpha-galactosidase (for beans/vegetables) target common problem foods.'
        },
        {
          pillar: 'movement',
          tip: 'Take a gentle 10-minute walk after eating',
          why: 'Walking helps move gas through your digestive system and stimulates the gastrocolic reflex. Importantly, avoid lying down after eating, which traps gas and slows digestion.'
        },
        {
          pillar: 'movement',
          tip: 'Try yoga poses: wind-relieving pose, child\'s pose, twists',
          why: 'These positions compress and massage the abdomen, physically helping to move trapped gas through the intestines and release it. They also relax abdominal muscles that may be holding tension.'
        },
        {
          pillar: 'mind',
          tip: 'Eat slowly and mindfully, without distractions',
          why: 'Eating quickly causes you to swallow air (aerophagia), a major cause of bloating. Stress eating also impairs digestion by keeping your body in fight-or-flight mode rather than rest-and-digest.'
        }
      ]
    },

    'nausea': {
      patterns: ['nausea', 'nauseous', 'feel sick', 'queasy', 'want to vomit', 'throw up', 'motion sick', 'morning sickness', 'sick to stomach'],
      title: 'Nausea',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Sip ginger tea slowly or chew on fresh ginger',
          why: 'Ginger contains gingerols and shogaols that block serotonin receptors in the gut (which trigger nausea) and accelerate gastric emptying. Studies show it\'s as effective as some prescription anti-nausea medications.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat small, bland meals - crackers, plain rice, banana',
          why: 'An empty stomach produces more acid, which worsens nausea. Small, bland foods absorb excess acid and provide gentle nutrients without requiring much digestive effort or stimulating more nausea.'
        },
        {
          pillar: 'nutrition',
          tip: 'Avoid strong smells, fatty, or spicy foods',
          why: 'Nausea heightens smell sensitivity dramatically. Fatty foods slow gastric emptying, keeping food in the stomach longer. Spicy foods can irritate an already sensitive stomach lining.'
        },
        {
          pillar: 'nutrition',
          tip: 'Try peppermint essential oil aromatherapy',
          why: 'Peppermint activates cold receptors in the nasal passages, which can interrupt nausea signals traveling to the brain. Studies show inhaling peppermint reduces nausea intensity within 2 minutes.'
        },
        {
          pillar: 'sleep',
          tip: 'Rest in a slightly upright or reclined position',
          why: 'Lying completely flat can worsen nausea by allowing stomach acid to move toward the esophagus. A slight incline (30-45°) uses gravity to keep stomach contents down where they belong.'
        },
        {
          pillar: 'mind',
          tip: 'Practice slow, deep breathing through the nose',
          why: 'Deep breathing activates the parasympathetic nervous system, reducing the stress response that often accompanies and worsens nausea. It also provides a focal point that distracts from the sensation.'
        },
        {
          pillar: 'movement',
          tip: 'Apply acupressure to the P6 point (inner wrist)',
          why: 'The P6 (Neiguan) point, located three finger-widths below the wrist crease between the tendons, affects vagus nerve signaling to the stomach. Studies validate its effectiveness for various types of nausea.'
        }
      ]
    },

    // ENERGY & FATIGUE
    'fatigue': {
      patterns: ['tired', 'fatigue', 'exhausted', 'no energy', 'low energy', 'drained', 'sluggish', 'lethargic', 'always tired', 'worn out', 'wiped out'],
      title: 'Fatigue & Low Energy',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Check iron levels - eat iron-rich foods with vitamin C',
          why: 'Iron deficiency is the most common nutritional cause of fatigue, especially in women. Iron carries oxygen to every cell for energy production. Vitamin C increases iron absorption by up to 300%.'
        },
        {
          pillar: 'nutrition',
          tip: 'Include protein at every meal to balance blood sugar',
          why: 'Blood sugar spikes from refined carbs cause the classic energy crash. Protein slows glucose absorption, providing steady, sustained energy instead of the spike-and-crash cycle.'
        },
        {
          pillar: 'nutrition',
          tip: 'Consider B12 supplementation, especially if vegetarian/vegan',
          why: 'B12 is essential for red blood cell formation and neurological function. Deficiency causes profound fatigue and is common because B12 is found naturally only in animal products.'
        },
        {
          pillar: 'nutrition',
          tip: 'Reduce sugar and refined carbohydrates',
          why: 'These cause rapid insulin spikes followed by crashes. Your body becomes trapped in a cycle of seeking quick energy, crashing, and seeking more - perpetuating chronic fatigue.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize 7-9 hours of sleep at consistent times',
          why: 'Sleep debt accumulates and can\'t be fully repaid with one good night. Consistent timing regulates your circadian rhythm, improving both sleep quality and daytime energy levels.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise even when tired - start with just 10 minutes',
          why: 'Counterintuitively, exercise CREATES energy by improving mitochondrial function (your cells\' energy factories) and releasing energizing endorphins. Start small to avoid the overwhelm that prevents action.'
        },
        {
          pillar: 'mind',
          tip: 'Assess your stress levels - chronic stress depletes energy reserves',
          why: 'Constant stress keeps cortisol elevated, which exhausts your adrenal glands over time. This "adrenal fatigue" pattern is a common hidden cause of persistent tiredness that sleep alone won\'t fix.'
        },
        {
          pillar: 'movement',
          tip: 'Get morning sunlight within 30 minutes of waking',
          why: 'Morning light stops melatonin production and triggers a healthy cortisol spike. This resets your circadian rhythm, dramatically improving both daytime energy and nighttime sleep quality.'
        }
      ]
    },

    // STRESS & ANXIETY
    'anxiety': {
      patterns: ['anxious', 'anxiety', 'worried', 'worrying', 'nervous', 'panic', 'panicking', 'racing thoughts', 'overwhelmed', 'cant relax', "can't relax"],
      title: 'Anxiety & Worry',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Reduce or eliminate caffeine completely',
          why: 'Caffeine blocks calming adenosine receptors and triggers adrenaline release. In anxiety-prone individuals, even small amounts can trigger or significantly worsen symptoms. Try herbal alternatives instead.'
        },
        {
          pillar: 'nutrition',
          tip: 'Increase omega-3 fatty acids (salmon, walnuts, flaxseed)',
          why: 'Omega-3s reduce inflammation in the brain that contributes to anxiety. Studies show they can reduce anxiety symptoms by 20% - comparable to medication for some people - within 3-4 weeks.'
        },
        {
          pillar: 'nutrition',
          tip: 'Try L-theanine supplement or drink green tea',
          why: 'L-theanine increases GABA, serotonin, and dopamine while promoting alpha brain waves (the relaxed-alert state). It provides calm focus without drowsiness, and effects are felt within 30-40 minutes.'
        },
        {
          pillar: 'sleep',
          tip: 'Maintain a strict sleep schedule - anxiety worsens dramatically with poor sleep',
          why: 'Sleep deprivation increases amygdala reactivity (your brain\'s fear center) by 60%. This means you literally become more anxious with less sleep. Good sleep is foundational for emotional regulation.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise for at least 20 minutes - any form works',
          why: 'Exercise metabolizes stress hormones (adrenaline, cortisol) that accumulate during anxiety. It also releases endorphins, provides a sense of accomplishment, and gives your mind a break from worrying.'
        },
        {
          pillar: 'mind',
          tip: 'Practice box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s',
          why: 'This specific pattern activates the vagus nerve and shifts your nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest) within 2-3 minutes. It\'s a physiological reset button.'
        },
        {
          pillar: 'mind',
          tip: 'Use the 5-4-3-2-1 grounding technique',
          why: 'Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste. This forces your brain out of future-focused anxious thoughts and into present-moment sensory awareness, breaking the anxiety cycle.'
        },
        {
          pillar: 'mind',
          tip: 'Try adaptogenic herbs: ashwagandha (300-600mg daily)',
          why: 'Ashwagandha helps your body "adapt" to stress by regulating the HPA axis (your stress response system). Clinical studies show it reduces cortisol levels by up to 30% within 8 weeks.'
        }
      ]
    },

    'stress': {
      patterns: ['stressed', 'stress', 'pressure', 'tension', 'tense', 'overwhelm', 'burnout', 'burned out', 'too much', 'overworked'],
      title: 'Stress & Tension',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Eat magnesium-rich foods: dark leafy greens, nuts, dark chocolate',
          why: 'Stress rapidly depletes magnesium, and low magnesium increases stress sensitivity - a vicious cycle. Magnesium is called "nature\'s relaxant" for its calming effects on muscles and nervous system.'
        },
        {
          pillar: 'nutrition',
          tip: 'Limit alcohol - it disrupts sleep and increases rebound anxiety',
          why: 'While alcohol initially feels relaxing, it disrupts REM sleep, increases cortisol as it metabolizes, and depletes B vitamins needed for stress resilience. The "relaxation" is followed by worse anxiety.'
        },
        {
          pillar: 'nutrition',
          tip: 'Drink herbal teas: chamomile, lemon balm, passionflower',
          why: 'These herbs contain compounds that naturally enhance GABA activity in the brain, promoting calm. The ritual of making and drinking tea also provides a mindful pause and moment of self-care.'
        },
        {
          pillar: 'sleep',
          tip: 'Create a worry journal - write concerns 2 hours before bed, not at bedtime',
          why: 'Writing externalizes worries so your brain doesn\'t need to "hold" them. Doing this earlier (not at bedtime) allows time to process stress while still transitioning into relaxation mode for sleep.'
        },
        {
          pillar: 'movement',
          tip: 'Practice progressive muscle relaxation (10 minutes)',
          why: 'Systematically tensing and releasing muscle groups (feet to head) teaches your body the physical difference between tension and relaxation. It releases stress physically held in the body.'
        },
        {
          pillar: 'movement',
          tip: 'Take a walk in nature - even 20 minutes makes a difference',
          why: 'Nature exposure lowers cortisol, blood pressure, and heart rate through mechanisms we don\'t fully understand. The Japanese practice of "forest bathing" has been shown to reduce stress hormones for up to 7 days.'
        },
        {
          pillar: 'mind',
          tip: 'Practice time-blocking and learn to say "no"',
          why: 'Overcommitment is a leading cause of chronic stress. Setting boundaries protects your time and energy. Remember: not everything urgent is actually important, and saying no to one thing means saying yes to yourself.'
        },
        {
          pillar: 'mind',
          tip: 'Schedule daily "worry time" - 15 dedicated minutes to address concerns',
          why: 'Containing worries to a specific time prevents them from hijacking your entire day. When worries arise outside this time, note them for later and refocus on the present moment.'
        }
      ]
    },

    // HEADACHE & PAIN
    'headache': {
      patterns: ['headache', 'head hurts', 'migraine', 'head pain', 'temple pain', 'head ache', 'throbbing head', 'pounding head'],
      title: 'Headache & Migraine',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Drink 2-3 large glasses of water immediately',
          why: 'Dehydration is the #1 cause of headaches. Even 1-2% dehydration triggers headaches because your brain sits in fluid - dehydration causes it to temporarily shrink, pulling away from the skull and causing pain.'
        },
        {
          pillar: 'nutrition',
          tip: 'Identify food triggers: aged cheese, alcohol, MSG, artificial sweeteners, chocolate',
          why: 'These foods contain tyramine, histamine, or other compounds that can trigger headaches in sensitive individuals by affecting blood vessel dilation and neurotransmitter levels.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take magnesium supplements (400mg daily for prevention)',
          why: 'Magnesium deficiency is found in up to 50% of migraine sufferers. Magnesium regulates neurotransmitters and blood vessel constriction. Studies show consistent supplementation reduces migraine frequency by 41%.'
        },
        {
          pillar: 'nutrition',
          tip: 'Try riboflavin (vitamin B2) 400mg daily for prevention',
          why: 'Riboflavin is essential for mitochondrial energy production in brain cells. Multiple studies show it reduces migraine frequency by 50% when taken consistently for 2-3 months.'
        },
        {
          pillar: 'sleep',
          tip: 'Maintain consistent sleep times - irregularity triggers headaches',
          why: 'Sleep disruption affects serotonin levels, which regulate pain perception and blood vessel dilation. Both too little AND too much sleep can trigger headaches through this mechanism.'
        },
        {
          pillar: 'movement',
          tip: 'Apply peppermint essential oil (diluted) to temples and neck',
          why: 'Peppermint contains menthol, which activates cold receptors and causes blood vessels to constrict initially, then dilate. Studies show it\'s as effective as acetaminophen (Tylenol) for tension headaches.'
        },
        {
          pillar: 'mind',
          tip: 'Release jaw tension - consciously notice if you\'re clenching',
          why: 'Jaw clenching (often unconscious, especially during stress) strains the temporalis and masseter muscles, which refer pain throughout the head. Relaxing the jaw can provide immediate relief.'
        },
        {
          pillar: 'movement',
          tip: 'Do gentle neck stretches and shoulder rolls every hour',
          why: 'Tension in the neck and shoulders (common from screens and stress) restricts blood flow to the head and creates trigger points that refer pain upward. Regular stretching prevents this buildup.'
        }
      ]
    },

    // MOOD
    'depression': {
      patterns: ['depressed', 'depression', 'sad', 'down', 'hopeless', 'unmotivated', 'empty', 'no motivation', 'feeling low', 'lost interest', 'numb'],
      title: 'Low Mood & Depression',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Significantly increase omega-3 fatty acids (fish oil 2-3g daily)',
          why: 'The brain is 60% fat and requires omega-3s for neurotransmitter function and reducing inflammation. Countries with high fish consumption have dramatically lower depression rates. Effects may take 4-6 weeks.'
        },
        {
          pillar: 'nutrition',
          tip: 'Check vitamin D levels and supplement if low (2000-5000 IU daily)',
          why: 'Vitamin D receptors exist throughout the brain, particularly in areas regulating mood. Deficiency is strongly linked to depression. Many people are deficient, especially in winter or if spending time indoors.'
        },
        {
          pillar: 'nutrition',
          tip: 'Support gut health with fermented foods and probiotics',
          why: '95% of serotonin (your "happiness" neurotransmitter) is produced in the gut. The gut-brain axis means gut inflammation directly affects mood. Certain probiotic strains have been shown to reduce depression symptoms.'
        },
        {
          pillar: 'sleep',
          tip: 'Avoid oversleeping - set an alarm even on weekends',
          why: 'Depression often causes oversleeping, but excessive sleep actually worsens depression by disrupting circadian rhythms and reducing exposure to light and social cues that regulate mood.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise daily, even if just a 10-minute walk',
          why: 'Exercise is as effective as antidepressants for mild-moderate depression. It increases BDNF (brain growth factor), serotonin, and dopamine. The key is consistency, not intensity. Small actions build momentum.'
        },
        {
          pillar: 'movement',
          tip: 'Get morning sunlight for at least 15-30 minutes',
          why: 'Light therapy is a proven treatment for depression. Morning light resets circadian rhythms, suppresses melatonin, and directly boosts serotonin production. Even on cloudy days, outdoor light is 10x brighter than indoor.'
        },
        {
          pillar: 'mind',
          tip: 'Connect with someone - isolation worsens depression',
          why: 'Social connection triggers oxytocin release and provides perspective. Depression lies and tells you others don\'t want to hear from you. Reach out anyway - even brief positive interactions interrupt negative spirals.'
        },
        {
          pillar: 'mind',
          tip: 'Start with tiny accomplishments - make your bed, take a shower',
          why: 'Depression creates paralysis where everything feels overwhelming. Small wins generate dopamine and momentum, proving to your brain that action is possible. Don\'t aim for big - aim for done.'
        }
      ]
    },

    // FOCUS & CONCENTRATION
    'focus': {
      patterns: ['focus', 'concentrate', 'concentration', 'distracted', 'brain fog', 'foggy', 'cant think', "can't think", 'scatter', 'attention', 'unfocused'],
      title: 'Focus & Concentration Issues',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Stay hydrated - drink water consistently throughout the day',
          why: 'Your brain is 75% water. Just 2% dehydration significantly reduces attention, memory, and mental processing speed. Studies show water improves reaction time and focus within 20 minutes of drinking.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat brain foods: fatty fish, blueberries, walnuts, eggs',
          why: 'These contain omega-3s (brain cell membrane health), antioxidants (protect neurons), and choline (acetylcholine precursor for focus). They provide the raw materials your brain needs for optimal function.'
        },
        {
          pillar: 'nutrition',
          tip: 'Try Lion\'s Mane mushroom supplement (500-1000mg daily)',
          why: 'Lion\'s Mane stimulates NGF (nerve growth factor) production, supporting neuroplasticity and the growth of new brain cells. Users consistently report improved mental clarity within 2-4 weeks.'
        },
        {
          pillar: 'nutrition',
          tip: 'Balance blood sugar - avoid refined carbs and sugar',
          why: 'Your brain uses 20% of your body\'s glucose despite being only 2% of your weight. Blood sugar spikes and crashes directly impair mental clarity. Stable blood sugar = stable focus.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize sleep - it consolidates memory and clears brain toxins',
          why: 'During sleep, your brain\'s glymphatic system clears metabolic waste (including proteins linked to Alzheimer\'s). Poor sleep leads to "brain fog" from accumulated toxins and impaired memory consolidation.'
        },
        {
          pillar: 'movement',
          tip: 'Take movement breaks every 50-90 minutes',
          why: 'Your brain naturally cycles through attention spans of about 90 minutes (ultradian rhythms). Movement increases blood flow to the brain by 15% and refreshes neurotransmitter levels depleted by focused work.'
        },
        {
          pillar: 'mind',
          tip: 'Practice single-tasking - multitasking is a cognitive myth',
          why: 'The brain can only focus on one cognitive task at a time. "Multitasking" is actually rapid task-switching, which depletes mental energy and increases errors by 50%. Single-tasking is faster and less exhausting.'
        },
        {
          pillar: 'mind',
          tip: 'Use the Pomodoro technique: 25 min focus, 5 min break',
          why: 'This method works with your brain\'s natural attention cycles rather than fighting them. The time pressure creates productive urgency, and scheduled breaks prevent the mental fatigue that kills focus.'
        }
      ]
    },

    // MUSCLE & BODY PAIN
    'muscle_soreness': {
      patterns: ['muscle sore', 'muscles sore', 'sore muscles', 'muscle pain', 'body ache', 'aching muscles', 'muscle ache', 'stiff muscles', 'muscle tension', 'tight muscles', 'doms', 'workout soreness', 'muscle hurt', 'muscles hurt', 'hurts muscle', 'my muscles', 'body hurts', 'muscles are', 'muscle is'],
      title: 'Muscle Soreness & Body Aches',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Increase protein intake (1.6-2.2g per kg body weight)',
          why: 'Protein provides amino acids essential for muscle repair. After exercise or strain, muscles need building blocks to rebuild stronger. Leucine specifically triggers muscle protein synthesis.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat anti-inflammatory foods: fatty fish, turmeric, ginger, tart cherries',
          why: 'These contain compounds that reduce inflammation and oxidative stress in muscle tissue. Tart cherry juice has been shown to reduce muscle soreness by 20% and speed recovery.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take magnesium (400mg daily) - topical or oral',
          why: 'Magnesium is essential for muscle relaxation and reducing cramps. It helps clear lactic acid buildup and supports over 300 enzymatic reactions involved in muscle function and recovery.'
        },
        {
          pillar: 'nutrition',
          tip: 'Stay well hydrated with electrolytes',
          why: 'Dehydration worsens muscle soreness and delays recovery. Electrolytes (sodium, potassium, magnesium) maintain proper muscle function and help flush metabolic waste products.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize 7-9 hours of sleep for recovery',
          why: 'Growth hormone, essential for muscle repair, is released primarily during deep sleep. Poor sleep reduces muscle protein synthesis by up to 18% and prolongs soreness.'
        },
        {
          pillar: 'movement',
          tip: 'Do light active recovery - walking, gentle stretching, swimming',
          why: 'Light movement increases blood flow to sore muscles, delivering nutrients and removing waste products. Complete rest actually delays recovery compared to gentle active movement.'
        },
        {
          pillar: 'movement',
          tip: 'Try foam rolling or self-massage for 10-15 minutes',
          why: 'Foam rolling breaks up adhesions in fascia (connective tissue) and increases blood flow. Studies show it reduces delayed onset muscle soreness (DOMS) by 50% when done after exercise.'
        },
        {
          pillar: 'mind',
          tip: 'Take an Epsom salt bath (2 cups in warm water, 20 minutes)',
          why: 'Epsom salt contains magnesium sulfate, which is absorbed through the skin to relax muscles. The warm water also increases circulation and provides soothing relief.'
        }
      ]
    },

    // MENSTRUAL & HORMONAL ISSUES
    'period_loss': {
      patterns: ['lost period', 'lost my period', 'no period', 'missing period', 'period stopped', 'amenorrhea', 'irregular period', 'skipped period', 'late period', 'period missing', "haven't had period", 'period is late', 'period late', 'missed period', 'miss my period', 'period gone', 'without period', "don't have period", "didn't get period", "didn't get my period", 'no menstrual', 'stopped menstruating'],
      title: 'Missing or Irregular Period (Amenorrhea)',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Ensure you are eating ENOUGH calories - undereating is a common cause',
          why: 'Your body needs adequate energy to support reproductive function. When calorie intake is too low, the hypothalamus suppresses reproductive hormones to conserve energy for vital functions.'
        },
        {
          pillar: 'nutrition',
          tip: 'Include healthy fats: avocado, olive oil, nuts, fatty fish',
          why: 'Fats are essential for hormone production - estrogen, progesterone, and other reproductive hormones are made from cholesterol. Low-fat diets can disrupt the menstrual cycle.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat enough carbohydrates - don\'t restrict them severely',
          why: 'Carbohydrates signal to your brain that food is available. Very low-carb diets can increase cortisol and suppress leptin, both of which can shut down ovulation.'
        },
        {
          pillar: 'nutrition',
          tip: 'Support with vitex (chasteberry) and maca root',
          why: 'Vitex helps regulate the pituitary gland and balance progesterone levels. Maca is an adaptogen that supports the HPA axis and has been shown to help restore menstrual regularity.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize consistent, quality sleep (7-9 hours)',
          why: 'Sleep disruption affects the hypothalamic-pituitary-ovarian axis that controls your menstrual cycle. Irregular sleep patterns can cause irregular periods or loss of ovulation.'
        },
        {
          pillar: 'movement',
          tip: 'Reduce exercise intensity if you train heavily',
          why: 'Excessive exercise without adequate fueling causes hypothalamic amenorrhea. Your body perceives intense training as stress and shuts down reproduction. Consider reducing volume by 20-30%.'
        },
        {
          pillar: 'movement',
          tip: 'Focus on gentle, restorative movement: yoga, walking, swimming',
          why: 'Gentle movement supports hormonal balance without adding stress. Restorative yoga specifically activates the parasympathetic nervous system, helping to normalize cortisol and reproductive hormones.'
        },
        {
          pillar: 'mind',
          tip: 'Address chronic stress - it directly affects your cycle',
          why: 'Cortisol (stress hormone) and reproductive hormones share the same precursor. Chronic stress causes the body to prioritize cortisol over estrogen and progesterone, leading to cycle disruption.'
        }
      ]
    },

    'period_pain': {
      patterns: ['period pain', 'menstrual cramps', 'cramps', 'painful period', 'period cramp', 'dysmenorrhea', 'pms', 'menstrual pain'],
      title: 'Menstrual Cramps & Period Pain',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Take magnesium (300-400mg daily), especially before and during period',
          why: 'Magnesium relaxes the smooth muscle of the uterus, reducing cramping intensity. Studies show it can reduce menstrual pain by up to 84% when taken consistently.'
        },
        {
          pillar: 'nutrition',
          tip: 'Increase omega-3 fatty acids (fish oil, flaxseed)',
          why: 'Omega-3s reduce inflammatory prostaglandins - the compounds that cause uterine contractions and pain. Women with higher omega-3 intake report significantly less menstrual pain.'
        },
        {
          pillar: 'nutrition',
          tip: 'Drink ginger tea - 1-2 cups daily during your period',
          why: 'Ginger inhibits prostaglandin synthesis and has been shown to be as effective as ibuprofen for menstrual pain. It also helps with associated nausea.'
        },
        {
          pillar: 'nutrition',
          tip: 'Reduce inflammatory foods: sugar, processed foods, alcohol',
          why: 'These foods increase systemic inflammation and prostaglandin production, worsening cramps. Many women notice significant improvement when removing these during their period.'
        },
        {
          pillar: 'sleep',
          tip: 'Rest more during your period - your body needs it',
          why: 'Progesterone drops sharply during menstruation, which can affect sleep quality. Extra rest supports your body through this demanding phase and reduces pain perception.'
        },
        {
          pillar: 'movement',
          tip: 'Apply heat to your lower abdomen (heating pad, warm bath)',
          why: 'Heat relaxes the contracting uterine muscles and increases blood flow. Studies show heat therapy is as effective as ibuprofen for menstrual cramps.'
        },
        {
          pillar: 'movement',
          tip: 'Try gentle yoga poses: child\'s pose, cat-cow, supine twist',
          why: 'These poses increase blood flow to the pelvic region, relax tight muscles, and stimulate the parasympathetic nervous system, providing natural pain relief.'
        },
        {
          pillar: 'mind',
          tip: 'Practice deep breathing and relaxation techniques',
          why: 'Pain perception is amplified by stress and tension. Deep breathing activates the vagus nerve, reducing pain signals and helping your body relax through the discomfort.'
        }
      ]
    },

    // SKIN ISSUES
    'acne': {
      patterns: ['acne', 'pimples', 'breakout', 'skin breaking out', 'zits', 'spots on face', 'oily skin', 'blemishes'],
      title: 'Acne & Skin Breakouts',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Reduce dairy consumption, especially skim milk',
          why: 'Dairy contains hormones and growth factors that can trigger acne. Skim milk is particularly problematic because removing fat concentrates the hormonal components.'
        },
        {
          pillar: 'nutrition',
          tip: 'Lower glycemic load - reduce sugar and refined carbs',
          why: 'High-glycemic foods spike insulin, which increases androgens and sebum production. Studies show low-glycemic diets reduce acne lesions by 50% in 12 weeks.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take zinc supplements (30mg daily)',
          why: 'Zinc reduces inflammation, inhibits acne-causing bacteria, and helps regulate sebum production. People with acne often have 24% lower zinc levels than those without.'
        },
        {
          pillar: 'nutrition',
          tip: 'Increase omega-3 fatty acids and reduce omega-6',
          why: 'The Western diet is heavy in omega-6 (inflammatory) vs omega-3 (anti-inflammatory). This imbalance promotes the inflammatory response that causes acne lesions.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize quality sleep - skin repairs overnight',
          why: 'Sleep deprivation increases cortisol, which stimulates sebaceous glands and worsens acne. Growth hormone released during sleep is essential for skin cell repair and renewal.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise regularly but shower immediately after',
          why: 'Exercise reduces stress and improves circulation to the skin. However, sweat mixed with bacteria can clog pores, so cleansing after workouts is essential.'
        },
        {
          pillar: 'mind',
          tip: 'Manage stress - cortisol directly triggers breakouts',
          why: 'Stress hormones stimulate oil glands and slow skin healing. Studies show students have more acne during exam periods. Stress management is a legitimate acne treatment.'
        },
        {
          pillar: 'nutrition',
          tip: 'Support gut health with probiotics and fermented foods',
          why: 'The gut-skin axis is real - gut inflammation and dysbiosis show up on your skin. Probiotics have been shown to reduce acne severity and inflammation markers.'
        }
      ]
    },

    // IMMUNE SYSTEM
    'immunity': {
      patterns: ['sick often', 'weak immune', 'immunity', 'getting sick', 'catch cold', 'always sick', 'low immunity', 'immune system'],
      title: 'Weak Immunity / Getting Sick Often',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Eat vitamin C rich foods daily: citrus, bell peppers, kiwi, berries',
          why: 'Vitamin C supports production and function of white blood cells. Your body can\'t store it, so daily intake is essential. It also acts as an antioxidant protecting immune cells.'
        },
        {
          pillar: 'nutrition',
          tip: 'Include zinc-rich foods: pumpkin seeds, chickpeas, oysters, beef',
          why: 'Zinc is critical for immune cell development and function. Even mild deficiency impairs immunity. Zinc supplements can shorten cold duration by 33% if taken early.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat garlic and onions regularly - raw when possible',
          why: 'Allicin in garlic has antimicrobial properties and stimulates immune cells. Studies show regular garlic consumption reduces cold frequency by 63%.'
        },
        {
          pillar: 'nutrition',
          tip: 'Support gut health - 70% of immunity is in your gut',
          why: 'Your gut contains most of your immune tissue (GALT). Healthy gut bacteria train immune cells and provide a barrier against pathogens. Probiotics and fiber support this system.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize 7-9 hours of quality sleep',
          why: 'During sleep, your body produces cytokines needed to fight infection. One night of poor sleep reduces natural killer cell activity by up to 70%, dramatically impairing immunity.'
        },
        {
          pillar: 'movement',
          tip: 'Exercise moderately - 30-45 minutes most days',
          why: 'Moderate exercise improves circulation of immune cells and reduces inflammation. However, excessive intense exercise suppresses immunity - balance is key.'
        },
        {
          pillar: 'mind',
          tip: 'Manage chronic stress - it suppresses immune function',
          why: 'Chronic stress elevates cortisol, which directly suppresses immune cell production and function. Stress management is genuinely protective against illness.'
        },
        {
          pillar: 'nutrition',
          tip: 'Ensure adequate vitamin D (2000-5000 IU daily)',
          why: 'Vitamin D receptors exist on immune cells and are essential for activating them. Deficiency is linked to increased susceptibility to infections. Most people are deficient.'
        }
      ]
    },

    // BACK PAIN
    'back_pain': {
      patterns: ['back pain', 'lower back', 'back hurts', 'back ache', 'backache', 'spine pain', 'back sore'],
      title: 'Back Pain',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Reduce inflammatory foods: sugar, processed foods, vegetable oils',
          why: 'Chronic inflammation contributes to back pain and slows healing. Anti-inflammatory eating reduces pain signals and supports tissue repair.'
        },
        {
          pillar: 'nutrition',
          tip: 'Increase omega-3s and turmeric/curcumin',
          why: 'Omega-3s and curcumin are potent natural anti-inflammatories. Curcumin has been shown to be as effective as ibuprofen for some types of pain without the side effects.'
        },
        {
          pillar: 'nutrition',
          tip: 'Ensure adequate magnesium intake',
          why: 'Magnesium relaxes muscles and reduces muscle spasms that often accompany back pain. It also helps with the nerve signaling involved in chronic pain conditions.'
        },
        {
          pillar: 'sleep',
          tip: 'Optimize sleep position - pillow between knees if side sleeping',
          why: 'Poor sleep positions stress the spine all night. A pillow between the knees maintains spinal alignment. Sleeping on your back with knee support is often best for back pain.'
        },
        {
          pillar: 'movement',
          tip: 'Avoid prolonged sitting - stand or move every 30 minutes',
          why: 'Sitting compresses spinal discs and weakens supporting muscles. Regular movement breaks maintain disc hydration and blood flow to the area.'
        },
        {
          pillar: 'movement',
          tip: 'Strengthen your core - it supports your spine',
          why: 'Weak core muscles force your spine to do more work, leading to pain. Exercises like planks, bird-dogs, and bridges build the muscular support your back needs.'
        },
        {
          pillar: 'movement',
          tip: 'Try cat-cow stretches, child\'s pose, and gentle spinal twists',
          why: 'These movements gently mobilize the spine, release muscle tension, and improve blood flow to the area. Regular stretching prevents stiffness from worsening pain.'
        },
        {
          pillar: 'mind',
          tip: 'Address stress and emotional factors',
          why: 'Chronic back pain has a strong mind-body component. Stress causes muscle tension and amplifies pain perception. Techniques like mindfulness reduce chronic pain by changing how the brain processes it.'
        }
      ]
    },

    // WEIGHT MANAGEMENT
    'weight_loss': {
      patterns: ['lose weight', 'weight loss', 'losing weight', 'fat loss', 'overweight', 'diet', 'slim down', 'burn fat'],
      title: 'Healthy Weight Management',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Focus on protein - aim for 1.6-2g per kg body weight',
          why: 'Protein increases satiety hormones, reduces hunger hormones, and requires more calories to digest (thermic effect). Higher protein diets preserve muscle during weight loss and boost metabolism.'
        },
        {
          pillar: 'nutrition',
          tip: 'Eat fiber-rich vegetables with every meal',
          why: 'Fiber creates bulk without calories, slows digestion for lasting fullness, and feeds beneficial gut bacteria that regulate metabolism and appetite hormones.'
        },
        {
          pillar: 'nutrition',
          tip: 'Practice time-restricted eating (12-16 hour overnight fast)',
          why: 'Giving your digestive system a break allows insulin levels to drop, enabling fat burning. It also naturally reduces calorie intake and improves metabolic flexibility.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize 7-9 hours of sleep',
          why: 'Sleep deprivation increases ghrelin (hunger) by 15%, decreases leptin (fullness) by 15%, and increases cravings for high-calorie foods by 45%. Sleep is essential for weight management.'
        },
        {
          pillar: 'movement',
          tip: 'Include strength training 2-3 times per week',
          why: 'Muscle is metabolically active tissue - each pound burns 6-10 calories daily at rest. Strength training also improves insulin sensitivity, helping your body use food for energy rather than storage.'
        },
        {
          pillar: 'movement',
          tip: 'Increase daily movement (NEAT) - walk more, take stairs',
          why: 'Non-exercise activity thermogenesis (NEAT) can vary by 2000 calories between people. Small changes like parking further, standing desks, and walking meetings add up significantly.'
        },
        {
          pillar: 'mind',
          tip: 'Address emotional eating with awareness',
          why: 'Many eating decisions are emotionally driven. Pausing before eating to ask "Am I physically hungry?" helps distinguish true hunger from emotional triggers.'
        },
        {
          pillar: 'mind',
          tip: 'Focus on adding healthy behaviors, not just restricting',
          why: 'Restriction creates psychological reactance and increases cravings. Adding vegetables, protein, and water naturally crowds out less nutritious choices without depleting willpower.'
        }
      ]
    },

    // HAIR LOSS
    'hair_loss': {
      patterns: ['hair loss', 'losing hair', 'hair falling', 'thinning hair', 'bald', 'hair shedding', 'hair fall'],
      title: 'Hair Loss & Thinning',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Check iron and ferritin levels - supplement if low',
          why: 'Iron deficiency is one of the most common causes of hair loss, especially in women. Hair follicles need iron to grow. Ferritin should be above 70 for optimal hair growth.'
        },
        {
          pillar: 'nutrition',
          tip: 'Ensure adequate protein intake',
          why: 'Hair is made of protein (keratin). When protein is scarce, your body diverts it away from hair growth to more essential functions. Aim for at least 0.8g per kg body weight.'
        },
        {
          pillar: 'nutrition',
          tip: 'Take biotin (2500-5000mcg) and zinc (30mg)',
          why: 'Biotin is essential for keratin production. Zinc supports hair follicle health and protein synthesis. Both deficiencies are linked to hair loss.'
        },
        {
          pillar: 'nutrition',
          tip: 'Include omega-3 fatty acids for scalp health',
          why: 'Omega-3s nourish hair follicles, reduce scalp inflammation, and promote shine. They support the lipid layer that keeps your scalp and hair hydrated.'
        },
        {
          pillar: 'sleep',
          tip: 'Prioritize sleep - growth hormone supports hair',
          why: 'Growth hormone released during sleep promotes cell regeneration including hair follicle cells. Chronic sleep deprivation can contribute to hair thinning.'
        },
        {
          pillar: 'movement',
          tip: 'Manage stress - it\'s a major cause of hair loss',
          why: 'Stress triggers telogen effluvium (shedding) and can worsen pattern hair loss. Cortisol disrupts the hair growth cycle. Stress reduction is legitimate hair loss treatment.'
        },
        {
          pillar: 'mind',
          tip: 'Be patient - hair grows slowly (6+ months to see changes)',
          why: 'Hair follicles have a long growth cycle. Nutritional changes take 3-6 months to show in your hair. Consistency is more important than any single intervention.'
        },
        {
          pillar: 'nutrition',
          tip: 'Check thyroid function - it commonly causes hair loss',
          why: 'Both hypothyroidism and hyperthyroidism cause hair loss. If you have other symptoms like fatigue, weight changes, or cold sensitivity, get your thyroid tested.'
        }
      ]
    },

    // DEFAULT / GENERAL WELLNESS
    'general': {
      patterns: [],
      title: 'General Wellness',
      recommendations: [
        {
          pillar: 'nutrition',
          tip: 'Eat whole, unprocessed foods as much as possible',
          why: 'Processed foods lack nutrients and contain additives that disrupt gut bacteria, hormones, and inflammation levels. Whole foods provide the building blocks your body actually needs to function optimally.'
        },
        {
          pillar: 'nutrition',
          tip: 'Stay hydrated - most people are chronically mildly dehydrated',
          why: 'Water is essential for every bodily function: digestion, circulation, temperature regulation, toxin removal, and cognitive function. Even mild dehydration impairs mood, energy, and mental performance.'
        },
        {
          pillar: 'sleep',
          tip: 'Aim for 7-9 hours of sleep at consistent times',
          why: 'Sleep is when your body repairs tissue, your brain consolidates memories, your immune system strengthens, and hormones rebalance. Consistency helps your circadian rhythm optimize all these processes.'
        },
        {
          pillar: 'movement',
          tip: 'Move your body daily in ways that feel enjoyable',
          why: 'Regular movement improves cardiovascular health, mental health, metabolism, bone density, and longevity. The best exercise is the one you\'ll actually do consistently - find what you enjoy.'
        },
        {
          pillar: 'mind',
          tip: 'Practice gratitude daily - notice three good things',
          why: 'Gratitude literally rewires neural pathways toward positivity over time. Studies show consistent practice increases happiness by 25%, improves sleep quality, strengthens relationships, and boosts immune function.'
        },
        {
          pillar: 'mind',
          tip: 'Connect meaningfully with others regularly',
          why: 'Social connection is a fundamental human need hardwired into our biology. Loneliness has health risks comparable to smoking 15 cigarettes daily. Even brief positive interactions benefit mental and physical wellbeing.'
        }
      ]
    }
  };

  // DOM elements
  let elements = {};

  // Initialize
  function init() {
    elements.input = document.getElementById('wellnessInput');
    elements.submitBtn = document.getElementById('wellnessSubmitBtn');
    elements.response = document.getElementById('aiResponse');
    elements.responseContent = document.getElementById('aiResponseContent');
    
    if (elements.submitBtn) {
      elements.submitBtn.addEventListener('click', handleSubmit);
    }
    
    if (elements.input) {
      elements.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          handleSubmit();
        }
      });
    }
  }

  // Handle submission
  function handleSubmit() {
    const input = elements.input.value.trim().toLowerCase();
    
    if (!input) {
      App.showToast('Please describe what you\'re experiencing');
      return;
    }
    
    // Show loading
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<span class="loading">Analyzing your concern...</span>';
    
    // Simulate brief processing time for UX
    setTimeout(() => {
      const result = analyzeInput(input);
      displayRecommendations(result, input);
      
      elements.submitBtn.disabled = false;
      elements.submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Get Holistic Recommendations
      `;
    }, 800);
  }

  // Analyze input and find the best matching condition
  function analyzeInput(input) {
    let bestMatch = null;
    let highestScore = 0;
    
    // Normalize input: lowercase and remove extra spaces
    const normalizedInput = input.toLowerCase().trim();
    
    // Extract meaningful words (3+ characters) for word-based matching
    const inputWords = normalizedInput.split(/\s+/).filter(w => w.length >= 3);
    
    // Search through all conditions
    for (const [key, condition] of Object.entries(conditionsDB)) {
      if (key === 'general') continue;
      
      let score = 0;
      
      for (const pattern of condition.patterns) {
        // Direct pattern matching (exact phrase in input)
        if (normalizedInput.includes(pattern)) {
          score += pattern.length * 5; // High weight for exact matches
        }
      }
      
      // Keyword detection - this is the primary matching method
      const keywordMap = {
        'cant_sleep': ['cant sleep', "can't sleep", 'trouble sleep', 'hard to sleep', 'difficulty sleep', 'fall asleep', 'falling asleep'],
        'insomnia': ['wake up', 'waking up', 'awake at night', 'middle of the night', 'middle of night', 'cant stay asleep', "can't stay asleep", 'keep waking'],
        'period_loss': ['lost my period', 'lost period', 'no period', 'missing period', 'period stopped', 'irregular period', 'missed period', 'late period', 'amenorrhea'],
        'period_pain': ['period pain', 'menstrual cramp', 'cramps', 'painful period', 'pms'],
        'muscle_soreness': ['muscle', 'muscles', 'sore', 'soreness', 'body ache', 'aching', 'stiff'],
        'anxiety': ['anxious', 'anxiety', 'worried', 'worry', 'panic', 'nervous', 'racing thoughts'],
        'stress': ['stress', 'stressed', 'overwhelm', 'overwhelmed', 'pressure', 'burnout', 'burned out'],
        'fatigue': ['tired', 'fatigue', 'exhausted', 'no energy', 'low energy', 'drained', 'sluggish'],
        'headache': ['headache', 'head hurts', 'migraine', 'head pain'],
        'depression': ['depressed', 'depression', 'sad', 'hopeless', 'unmotivated', 'no motivation'],
        'diarrhea': ['diarrhea', 'loose stool', 'runny stomach', 'upset stomach'],
        'constipation': ['constipat', 'cant poop', "can't poop", 'hard stool', 'not regular'],
        'bloating': ['bloated', 'bloating', 'gassy', 'gas', 'distended'],
        'nausea': ['nausea', 'nauseous', 'queasy', 'want to vomit', 'throw up', 'sick to stomach'],
        'acne': ['acne', 'pimple', 'breakout', 'zits', 'blemish'],
        'hair_loss': ['hair loss', 'losing hair', 'hair falling', 'thinning hair', 'bald'],
        'back_pain': ['back pain', 'lower back', 'back hurts', 'backache'],
        'weight_loss': ['lose weight', 'weight loss', 'fat loss', 'overweight', 'diet'],
        'immunity': ['sick often', 'weak immune', 'getting sick', 'catch cold', 'always sick'],
        'focus': ['focus', 'concentrate', 'concentration', 'distracted', 'brain fog', 'cant think']
      };
      
      const keywords = keywordMap[key] || [];
      for (const keyword of keywords) {
        if (normalizedInput.includes(keyword)) {
          // Longer keyword phrases get higher scores (more specific)
          score += keyword.length * 3;
        }
      }
      
      // Single word matching for key terms (exact word match only)
      const singleWordMap = {
        'insomnia': ['wake', 'waking', 'awake', 'night'],
        'cant_sleep': ['sleep', 'sleeping', 'asleep', 'insomnia'],
        'period_loss': ['period', 'menstrual', 'amenorrhea'],
        'period_pain': ['cramps', 'cramping', 'pms'],
        'muscle_soreness': ['muscle', 'muscles', 'sore', 'aching', 'hurt', 'hurts', 'pain'],
        'fatigue': ['tired', 'exhausted', 'fatigue', 'drained'],
        'headache': ['headache', 'migraine'],
        'anxiety': ['anxious', 'anxiety', 'panic', 'worried'],
        'stress': ['stress', 'stressed', 'tense', 'tension'],
        'depression': ['depressed', 'depression', 'sad', 'hopeless'],
        'nausea': ['nausea', 'nauseous', 'queasy', 'vomit'],
        'bloating': ['bloated', 'bloating', 'gassy'],
        'diarrhea': ['diarrhea'],
        'constipation': ['constipated', 'constipation'],
        'acne': ['acne', 'pimples', 'breakout'],
        'hair_loss': ['hair', 'bald', 'balding'],
        'back_pain': ['back'],
        'weight_loss': ['weight', 'diet', 'overweight'],
        'immunity': ['immune', 'immunity', 'sick'],
        'focus': ['focus', 'concentrate', 'distracted', 'foggy']
      };
      
      const singleWords = singleWordMap[key] || [];
      for (const word of singleWords) {
        // Check if the exact word appears in input (with word boundaries)
        const regex = new RegExp('\\b' + word + '\\b', 'i');
        if (regex.test(normalizedInput)) {
          score += 10;
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = condition;
      }
    }
    
    // Fall back to general if no match found
    if (!bestMatch || highestScore === 0) {
      bestMatch = conditionsDB.general;
    }
    
    return bestMatch;
  }

  // Display recommendations with "Why?" buttons
  function displayRecommendations(condition, originalInput) {
    const pillarColors = {
      nutrition: '#6bc46b',
      sleep: '#7c9fd4',
      movement: '#f5a962',
      mind: '#c49bd4'
    };
    
    const pillarNames = {
      nutrition: 'Nutrition',
      sleep: 'Sleep',
      movement: 'Movement',
      mind: 'Mind & Emotions'
    };
    
    const pillarIcons = {
      nutrition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      sleep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      movement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><circle cx="12" cy="5" r="2"/><path d="M12 7v6M9 20l3-7 3 7"/></svg>',
      mind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    };
    
    // Group recommendations by pillar
    const grouped = { nutrition: [], sleep: [], movement: [], mind: [] };
    condition.recommendations.forEach(rec => {
      grouped[rec.pillar].push(rec);
    });
    
    let html = `
      <p style="margin-bottom: var(--space-lg); font-size: 0.9375rem; color: var(--color-text-secondary);">
        Based on your concern about <strong style="color: var(--color-text-primary);">"${condition.title}"</strong>, here are personalized holistic recommendations:
      </p>
    `;
    
    for (const [pillar, recs] of Object.entries(grouped)) {
      if (recs.length === 0) continue;
      
      html += `
        <div style="margin-bottom: var(--space-xl);">
          <h4 style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-md); color: ${pillarColors[pillar]};">
            ${pillarIcons[pillar]}
            ${pillarNames[pillar]}
          </h4>
          <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      `;
      
      recs.forEach((rec, idx) => {
        const whyId = `why-${pillar}-${idx}-${Date.now()}`;
        html += `
          <div style="background: var(--color-bg-input); padding: var(--space-md); border-radius: var(--radius-md); border-left: 3px solid ${pillarColors[pillar]};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-sm);">
              <p style="margin: 0; color: var(--color-text-primary); flex: 1; line-height: 1.5;">${rec.tip}</p>
              <button 
                onclick="WellnessAI.toggleWhy('${whyId}')"
                style="flex-shrink: 0; padding: 4px 12px; background: transparent; border: 1px solid ${pillarColors[pillar]}; border-radius: var(--radius-full); color: ${pillarColors[pillar]}; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                onmouseover="this.style.background='${pillarColors[pillar]}'; this.style.color='white';"
                onmouseout="this.style.background='transparent'; this.style.color='${pillarColors[pillar]}';"
              >
                Why?
              </button>
            </div>
            <div id="${whyId}" style="display: none; margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px dashed var(--color-border);">
              <p style="margin: 0; font-size: 0.8125rem; color: var(--color-text-secondary); line-height: 1.6;">
                <strong style="color: ${pillarColors[pillar]};">Why this helps:</strong> ${rec.why}
              </p>
            </div>
          </div>
        `;
      });
      
      html += '</div></div>';
    }
    
    elements.responseContent.innerHTML = html;
    elements.response.classList.add('active');
    
    // Scroll to response
    setTimeout(() => {
      elements.response.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // Toggle "Why?" explanation visibility
  function toggleWhy(id) {
    const el = document.getElementById(id);
    if (el) {
      const isHidden = el.style.display === 'none';
      el.style.display = isHidden ? 'block' : 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { init, toggleWhy };
})();
