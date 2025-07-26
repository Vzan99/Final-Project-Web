import * as Yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const singleExperienceSchema = Yup.object().shape({
  title: Yup.string()
    .required("Job Title is required")
    .max(50, "Job Title cannot exceed 50 characters"),
  companyName: Yup.string()
    .required("Company Name is required")
    .max(50, "Company Name cannot exceed 50 characters"),
  employmentType: Yup.string().required("Employment Type is required"),
  currentlyWorking: Yup.boolean(),
  startDate: Yup.date()
    .required("Start Date is required")
    .max(today, "Start date cannot be in the future"),
  endDate: Yup.date().when("currentlyWorking", {
    is: false,
    then: (schema) =>
      schema
        .required("End Date is required when not currently working")
        .max(today, "End date cannot be in the future")
        .test(
          "end-after-start",
          "End date cannot be before start date",
          function (endDate) {
            const { startDate } = this.parent;
            return (
              !startDate || !endDate || new Date(endDate) >= new Date(startDate)
            );
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  location: Yup.string()
    .required("Location is required")
    .max(50, "Location cannot exceed 50 characters"),
  locationType: Yup.string().required("Location Type is required"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),
});

export const experienceSchema = Yup.object().shape({
  experiences: Yup.array()
    .of(singleExperienceSchema)
    .min(1, "At least one experience is required"),
});
