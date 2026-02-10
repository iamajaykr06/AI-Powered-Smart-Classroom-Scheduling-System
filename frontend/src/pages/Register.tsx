import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Select from "../components/Select";
import AuthLayout from "../layouts/AuthLayout";
import { registerSchema, type RegisterFormData } from "../types/auth";
import "../styles/auth.css";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "admin", label: "Administrator" },
];

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("VALID REGISTRATION DATA:", data);
    // next step: send to backend
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join the Smart Classroom Scheduling System</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <Input
          label="Full Name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Select
          label="Role"
          {...register("role")}
          error={errors.role?.message}
          options={roleOptions}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button
          text={isSubmitting ? "Creating Account..." : "Create Account"}
          type="submit"
          disabled={isSubmitting}
        />
      </form>

      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
