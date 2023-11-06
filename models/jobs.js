import mongoose from "mongoose";
import validator from "validator";
import slugify from "slugify";

const jobSchema = new mongoose.Schema({
  slug: String,
  title: {
    type: String,
    required: [true, "Enter a job title."],
    trim: true,
    maxlength: [100, "Can not exceed 100 characters."],
  },
  description: {
    type: String,
    required: [true, "Enter a job description."],
    maxlength: [1000, "Can not exceed 1000 characters."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  address: {
    type: String,
    required: [true, "Enter an address."],
  },
  company: {
    type: String,
    required: [true, "Enter a Company name."],
  },
  industry: {
    type: [String],
    required: [true, "Enter an industry."],
    enum: {
      values: [
        "Business",
        "Information Technology",
        "Banking",
        "Education/Training",
        "Telecommunication",
        "Others",
      ],
      message: "Please select correct options.",
    },
  },
  jobType: {
    type: String,
    required: [true, "Enter a job type."],
    enum: {
      values: ["Permanent", "Temporary", "Internship"],
      message: "Please select correct options.",
    },
  },
  minEducation: {
    type: String,
    required: [true, "Enter a minimum education."],
    enum: {
      values: ["Bachelors", "Masters", "Phd"],
      message: "Please select correct options.",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: [true, "Enter an experience."],
    enum: {
      values: [
        "No Experience",
        "1 Year - 2 Years",
        "2 Year - 5 Years",
        "5 Years+",
      ],
      message: "Please select correct options.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Enter a salary."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
  applicantsApplied: {
    type: [Object],
    select: false,
  },
});

jobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export default mongoose.model("Job", jobSchema);
