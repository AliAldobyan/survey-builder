import type { SurveyTemplate } from "../src/types/survey.ts";

export const surveyTemplates: SurveyTemplate[] = [
  {
    id: "employee-satisfaction",
    settings: {
      title: "Employee Satisfaction Survey",
      description: "Tell us about your workplace experience and how we can improve it.",
      confirmationMessage: "Thank you for sharing your feedback. Your input helps us build a better workplace.",
    },
    name: { en: "Employee satisfaction", ar: "رضا الموظفين" },
    questions: [
      {
        id: "employee-rating",
        type: "RADIO",
        label: "How satisfied are you with your workplace?",
        required: true,
        options: [
          { id: "satisfied", label: "Satisfied" },
          { id: "neutral", label: "Neutral" },
          { id: "unsatisfied", label: "Unsatisfied" },
        ],
      },
      {
        id: "employee-feedback",
        type: "TEXT",
        label: "What could we improve?",
        required: false,
        multiline: true,
      },
    ],
  },
  {
    id: "customer-satisfaction",
    settings: {
      title: "Customer Satisfaction Survey",
      description: "We would love to hear about your recent experience with us.",
      confirmationMessage: "Thank you for your feedback. We appreciate your time and look forward to serving you again.",
    },
    name: { en: "Customer satisfaction", ar: "رضا العملاء" },
    questions: [
      {
        id: "customer-rating",
        type: "DDL",
        label: "How was your experience?",
        required: true,
        options: [
          { id: "excellent", label: "Excellent" },
          { id: "good", label: "Good" },
          { id: "poor", label: "Poor" },
        ],
      },
      {
        id: "customer-feedback",
        type: "TEXT",
        label: "Additional feedback",
        required: false,
        multiline: true,
      },
    ],
  },
];
