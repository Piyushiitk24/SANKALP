import type { CourseDefinition } from "../types";

export const bloomsTaxonomyCourse: CourseDefinition = {
  "title": "Bloom's Taxonomy",
  "imageSrc": "/bt.png",
  "units": [
    {
      "order": 1,
      "title": "Unit 1: The Basics of Bloom's Taxonomy",
      "description": "Learn the fundamentals of Bloom's Taxonomy",
      "lessons": [
        {
          "order": 1,
          "title": "Introduction to Bloom's Taxonomy",
          "challenges": [
            {
              "type": "SELECT",
              "question": "What is the primary purpose of Bloom's Taxonomy in education?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "To rank students based on their intelligence."
                },
                {
                  "correct": true,
                  "text": "To provide a framework for categorizing educational goals and objectives."
                },
                {
                  "correct": false,
                  "text": "To dictate the curriculum for all subjects."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Who led the team of educational psychologists that developed the taxonomy?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Benjamin Bloom"
                },
                {
                  "correct": false,
                  "text": "B.F. Skinner"
                },
                {
                  "correct": false,
                  "text": "Jean Piaget"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Bloom's Taxonomy is a hierarchical model, which means:",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "Each level builds upon the one before it."
                },
                {
                  "correct": false,
                  "text": "All levels are of equal importance."
                },
                {
                  "correct": false,
                  "text": "The levels are independent of each other."
                }
              ]
            }
          ]
        },
        {
          "order": 2,
          "title": "The Original vs. Revised Taxonomy",
          "challenges": [
            {
              "type": "SELECT",
              "question": "In the revised version of Bloom's Taxonomy, which is the highest level of cognitive skill?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Evaluating"
                },
                {
                  "correct": false,
                  "text": "Synthesizing"
                },
                {
                  "correct": true,
                  "text": "Creating"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the primary difference between the original and revised taxonomy?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "The revised version uses verbs instead of nouns for the levels."
                },
                {
                  "correct": false,
                  "text": "The original version had more levels."
                },
                {
                  "correct": false,
                  "text": "The revised version is only for digital learning."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which level was replaced by 'Creating' in the revised taxonomy?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "Knowledge"
                },
                {
                  "correct": true,
                  "text": "Synthesis"
                },
                {
                  "correct": false,
                  "text": "Application"
                }
              ]
            }
          ]
        },
        {
          "order": 3,
          "title": "The Cognitive Domain",
          "challenges": [
            {
              "type": "SELECT",
              "question": "The cognitive domain of Bloom's Taxonomy deals with:",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Emotional responses and attitudes."
                },
                {
                  "correct": true,
                  "text": "Intellectual skills and knowledge acquisition."
                },
                {
                  "correct": false,
                  "text": "Physical skills and motor abilities."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of these is a lower-order thinking skill in the cognitive domain?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Remembering"
                },
                {
                  "correct": false,
                  "text": "Analyzing"
                },
                {
                  "correct": false,
                  "text": "Evaluating"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of these is a higher-order thinking skill in the cognitive domain?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "Understanding"
                },
                {
                  "correct": false,
                  "text": "Applying"
                },
                {
                  "correct": true,
                  "text": "Creating"
                }
              ]
            }
          ]
        },
        {
          "order": 4,
          "title": "The Affective and Psychomotor Domains",
          "challenges": [
            {
              "type": "SELECT",
              "question": "A teacher wants to assess a student's ability to show empathy. Which domain of Bloom's Taxonomy would this fall under?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Cognitive"
                },
                {
                  "correct": true,
                  "text": "Affective"
                },
                {
                  "correct": false,
                  "text": "Psychomotor"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "The psychomotor domain focuses on:",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Physical skills and coordination"
                },
                {
                  "correct": false,
                  "text": "Problem-solving and critical thinking"
                },
                {
                  "correct": false,
                  "text": "Values and attitudes"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which activity primarily involves the affective domain?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "Solving a math problem"
                },
                {
                  "correct": true,
                  "text": "Participating in a group discussion"
                },
                {
                  "correct": false,
                  "text": "Writing a research paper"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "order": 2,
      "title": "Unit 2: The Lower-Order Thinking Skills (LOTS)",
      "description": "Focus on the foundational cognitive skills",
      "lessons": [
        {
          "order": 1,
          "title": "Remembering",
          "challenges": [
            {
              "type": "SELECT",
              "question": "Which of the following is an example of a \"Remembering\" level activity?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Summarizing a story."
                },
                {
                  "correct": true,
                  "text": "Recalling the dates of historical events."
                },
                {
                  "correct": false,
                  "text": "Writing a new ending for a play."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which verb is most associated with the 'Remembering' level?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "List"
                },
                {
                  "correct": false,
                  "text": "Explain"
                },
                {
                  "correct": false,
                  "text": "Critique"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "A student listing the capitals of European countries is operating at what level?",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "Remembering"
                },
                {
                  "correct": false,
                  "text": "Understanding"
                },
                {
                  "correct": false,
                  "text": "Applying"
                }
              ]
            }
          ]
        },
        {
          "order": 2,
          "title": "Understanding",
          "challenges": [
            {
              "type": "SELECT",
              "question": "A student who can explain a scientific concept in their own words is demonstrating which level of Bloom's Taxonomy?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Remembering"
                },
                {
                  "correct": true,
                  "text": "Understanding"
                },
                {
                  "correct": false,
                  "text": "Applying"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of the following is NOT an example of 'Understanding'?",
              "order": 2,
              "options": [
                {
                  "correct": false,
                  "text": "Paraphrasing a speech"
                },
                {
                  "correct": true,
                  "text": "Reciting a poem from memory"
                },
                {
                  "correct": false,
                  "text": "Giving examples of a concept"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the key difference between 'Remembering' and 'Understanding'?",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "Remembering is about recalling facts, while understanding is about explaining ideas."
                },
                {
                  "correct": false,
                  "text": "Understanding involves creating something new, while remembering does not."
                },
                {
                  "correct": false,
                  "text": "There is no difference between the two."
                }
              ]
            }
          ]
        },
        {
          "order": 3,
          "title": "Applying",
          "challenges": [
            {
              "type": "SELECT",
              "question": "\"Use the formula for calculating the area of a circle to solve the following problems.\" This is an example of an instruction at which level?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Remembering"
                },
                {
                  "correct": false,
                  "text": "Understanding"
                },
                {
                  "correct": true,
                  "text": "Applying"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of the following activities best represents the 'Applying' level?",
              "order": 2,
              "options": [
                {
                  "correct": false,
                  "text": "Listing the steps of a process."
                },
                {
                  "correct": true,
                  "text": "Using a learned procedure in a new situation."
                },
                {
                  "correct": false,
                  "text": "Explaining the theory behind a process."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is a key requirement for a student to be at the 'Applying' level?",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "The ability to use knowledge in a practical way."
                },
                {
                  "correct": false,
                  "text": "The ability to memorize facts and figures."
                },
                {
                  "correct": false,
                  "text": "The ability to form an opinion on a topic."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "order": 3,
      "title": "Unit 3: The Higher-Order Thinking Skills (HOTS)",
      "description": "Explore the more advanced cognitive skills",
      "lessons": [
        {
          "order": 1,
          "title": "Analyzing",
          "challenges": [
            {
              "type": "SELECT",
              "question": "Which activity best represents the \"Analyzing\" level of Bloom's Taxonomy?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Listing the main characters in a story."
                },
                {
                  "correct": true,
                  "text": "Identifying the author's bias in a text."
                },
                {
                  "correct": false,
                  "text": "Writing a summary of an article."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the key difference between 'Analyzing' and 'Applying'?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Analyzing involves breaking down information, while applying involves using it."
                },
                {
                  "correct": false,
                  "text": "Applying is a higher-order skill than analyzing."
                },
                {
                  "correct": false,
                  "text": "They are essentially the same skill."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "A student who can distinguish between fact and opinion in a text is operating at which level?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "Understanding"
                },
                {
                  "correct": true,
                  "text": "Analyzing"
                },
                {
                  "correct": false,
                  "text": "Evaluating"
                }
              ]
            }
          ]
        },
        {
          "order": 2,
          "title": "Evaluating",
          "challenges": [
            {
              "type": "SELECT",
              "question": "When a student is asked to judge the credibility of a source, they are operating at which level?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Applying"
                },
                {
                  "correct": false,
                  "text": "Analyzing"
                },
                {
                  "correct": true,
                  "text": "Evaluating"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of the following is an example of an 'Evaluating' activity?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Critiquing a peer's essay"
                },
                {
                  "correct": false,
                  "text": "Summarizing the main points of an article"
                },
                {
                  "correct": false,
                  "text": "Creating a new story"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What distinguishes 'Analyzing' from 'Evaluating'?",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "Analyzing involves breaking down information, while evaluating involves making judgments."
                },
                {
                  "correct": false,
                  "text": "Evaluating is a lower-order skill than analyzing."
                },
                {
                  "correct": false,
                  "text": "They are essentially the same skill."
                }
              ]
            }
          ]
        },
        {
          "order": 3,
          "title": "Creating",
          "challenges": [
            {
              "type": "SELECT",
              "question": "Which of the following assignments requires students to use the \"Creating\" level of Bloom's Taxonomy?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Answering multiple-choice questions about a historical event."
                },
                {
                  "correct": true,
                  "text": "Designing a new product to solve a real-world problem."
                },
                {
                  "correct": false,
                  "text": "Following a set of instructions to build a model."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the highest level of cognitive skill in the revised Bloom's Taxonomy?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Creating"
                },
                {
                  "correct": false,
                  "text": "Evaluating"
                },
                {
                  "correct": false,
                  "text": "Analyzing"
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which verb is most associated with the 'Creating' level?",
              "order": 3,
              "options": [
                {
                  "correct": true,
                  "text": "Design"
                },
                {
                  "correct": false,
                  "text": "Critique"
                },
                {
                  "correct": false,
                  "text": "List"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "order": 4,
      "title": "Unit 4: Applying Bloom's Taxonomy in the Classroom",
      "description": "Learn to apply the taxonomy in a practical setting",
      "lessons": [
        {
          "order": 1,
          "title": "Writing Learning Objectives",
          "challenges": [
            {
              "type": "SELECT",
              "question": "Which of the following is a well-written learning objective at the \"Applying\" level?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "Students will be able to list the steps of the scientific method."
                },
                {
                  "correct": true,
                  "text": "Students will be able to use the scientific method to conduct a simple experiment."
                },
                {
                  "correct": false,
                  "text": "Students will appreciate the scientific method."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Why is it important to use action verbs when writing learning objectives?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "They describe observable and measurable behaviors."
                },
                {
                  "correct": false,
                  "text": "They make the objective sound more academic."
                },
                {
                  "correct": false,
                  "text": "They are easier for students to understand."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "A learning objective should be:",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "Vague and open-ended."
                },
                {
                  "correct": true,
                  "text": "Specific, measurable, achievable, relevant, and time-bound (SMART)."
                },
                {
                  "correct": false,
                  "text": "Focused on teacher activities rather than student learning."
                }
              ]
            }
          ]
        },
        {
          "order": 2,
          "title": "Designing Assessments",
          "challenges": [
            {
              "type": "SELECT",
              "question": "A teacher wants to create an assessment that targets higher-order thinking skills. Which of the following would be most appropriate?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "A true/false quiz."
                },
                {
                  "correct": true,
                  "text": "A project that requires students to design and build a solution to a problem."
                },
                {
                  "correct": false,
                  "text": "A matching exercise with vocabulary words and definitions."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the purpose of formative assessment?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "To monitor student learning and provide feedback."
                },
                {
                  "correct": false,
                  "text": "To grade students at the end of a unit."
                },
                {
                  "correct": false,
                  "text": "To compare students to each other."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is a key principle of good assessment design?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "It should be as difficult as possible."
                },
                {
                  "correct": true,
                  "text": "It should align with the learning objectives."
                },
                {
                  "correct": false,
                  "text": "It should be a surprise to the students."
                }
              ]
            }
          ]
        },
        {
          "order": 3,
          "title": "Differentiated Instruction",
          "challenges": [
            {
              "type": "SELECT",
              "question": "How can Bloom's Taxonomy be used to support differentiated instruction?",
              "order": 1,
              "options": [
                {
                  "correct": false,
                  "text": "By giving all students the same task, regardless of their ability."
                },
                {
                  "correct": true,
                  "text": "By creating a variety of tasks at different cognitive levels to meet the needs of all learners."
                },
                {
                  "correct": false,
                  "text": "By focusing only on lower-order thinking skills."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "Which of the following is an example of differentiating instruction based on student interest?",
              "order": 2,
              "options": [
                {
                  "correct": true,
                  "text": "Allowing students to choose their own research topic."
                },
                {
                  "correct": false,
                  "text": "Giving all students the same homework assignment."
                },
                {
                  "correct": false,
                  "text": "Using the same teaching method for all students."
                }
              ]
            },
            {
              "type": "SELECT",
              "question": "What is the main goal of differentiated instruction?",
              "order": 3,
              "options": [
                {
                  "correct": false,
                  "text": "To make sure all students get the same grade."
                },
                {
                  "correct": true,
                  "text": "To meet the diverse needs of all learners."
                },
                {
                  "correct": false,
                  "text": "To save time on lesson planning."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
