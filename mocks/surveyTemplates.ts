import type { SurveyTemplate } from "../src/types/survey.ts";

export const surveyTemplates: SurveyTemplate[] = [
  {
    "id": "employee-satisfaction",
    "name": {
      "en": "Employee satisfaction",
      "ar": "رضا الموظفين"
    },
    "content": {
      "en": {
        "settings": {
          "title": "Employee Satisfaction Survey",
          "description": "Tell us about your workplace experience and how we can improve it.",
          "confirmationMessage": "Thank you for sharing your feedback. Your input helps us build a better workplace."
        },
        "questions": [
          {
            "id": "employee-rating",
            "type": "RADIO",
            "label": "How satisfied are you with your workplace?",
            "required": true,
            "options": [
              {
                "id": "satisfied",
                "label": "Satisfied"
              },
              {
                "id": "neutral",
                "label": "Neutral"
              },
              {
                "id": "unsatisfied",
                "label": "Unsatisfied"
              }
            ]
          },
          {
            "id": "employee-feedback",
            "type": "TEXT",
            "label": "What could we improve?",
            "required": false,
            "multiline": true
          }
        ]
      },
      "ar": {
        "settings": {
          "title": "استبيان رضا الموظفين",
          "description": "شاركنا رأيك في بيئة العمل وما يمكننا تحسينه.",
          "confirmationMessage": "شكرًا لمشاركتك. تساعدنا آراؤك على تحسين بيئة العمل."
        },
        "questions": [
          {
            "id": "employee-rating",
            "type": "RADIO",
            "label": "ما مدى رضاك عن بيئة العمل؟",
            "required": true,
            "options": [
              {
                "id": "satisfied",
                "label": "راضٍ"
              },
              {
                "id": "neutral",
                "label": "محايد"
              },
              {
                "id": "unsatisfied",
                "label": "غير راضٍ"
              }
            ]
          },
          {
            "id": "employee-feedback",
            "type": "TEXT",
            "label": "ما الذي يمكننا تحسينه؟",
            "required": false,
            "multiline": true
          }
        ]
      }
    }
  },
  {
    "id": "customer-satisfaction",
    "name": {
      "en": "Customer satisfaction",
      "ar": "رضا العملاء"
    },
    "content": {
      "en": {
        "settings": {
          "title": "Customer Satisfaction Survey",
          "description": "We would love to hear about your recent experience with us.",
          "confirmationMessage": "Thank you for your feedback. We appreciate your time and look forward to serving you again."
        },
        "questions": [
          {
            "id": "customer-rating",
            "type": "DDL",
            "label": "How was your experience?",
            "required": true,
            "options": [
              {
                "id": "excellent",
                "label": "Excellent"
              },
              {
                "id": "good",
                "label": "Good"
              },
              {
                "id": "poor",
                "label": "Poor"
              }
            ]
          },
          {
            "id": "customer-feedback",
            "type": "TEXT",
            "label": "Additional feedback",
            "required": false,
            "multiline": true
          }
        ]
      },
      "ar": {
        "settings": {
          "title": "استبيان رضا العملاء",
          "description": "يسعدنا معرفة رأيك في تجربتك الأخيرة معنا.",
          "confirmationMessage": "شكرًا لمشاركة رأيك. نقدّر وقتك ونتطلع إلى خدمتك مجددًا."
        },
        "questions": [
          {
            "id": "customer-rating",
            "type": "DDL",
            "label": "كيف تقيّم تجربتك معنا؟",
            "required": true,
            "options": [
              {
                "id": "excellent",
                "label": "ممتازة"
              },
              {
                "id": "good",
                "label": "جيدة"
              },
              {
                "id": "poor",
                "label": "سيئة"
              }
            ]
          },
          {
            "id": "customer-feedback",
            "type": "TEXT",
            "label": "ملاحظات إضافية",
            "required": false,
            "multiline": true
          }
        ]
      }
    }
  }
];
