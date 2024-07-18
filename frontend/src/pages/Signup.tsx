import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = (): Partial<FormData> => {
    let errors: Partial<FormData> = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      errors.termsAccepted = "You must accept the terms and conditions";
    return errors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Handle successful form submission (e.g., send data to the server)
      console.log("Form submitted successfully", formData);
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
      setErrors({});
    }
  };

  return (
    <>
      <div className="flex flex-row w-full h-full items-center justify-center ">
        <div className="w-1/2 bg-gray-150 flex items-center justify-center">
          <div className="sm:max-w-md w-full">
            <h1 className="text-center text-2xl font-bold leading-tight tracking-wider text-gray-900 md:text-4xl">
              Create an account
              <p className="text-sm py-2 font-normal tracking-tight">
                Already have an account?{" "}
                <span className="font-bold">
                  {" "}
                  <Link to={"/signin"}>Login</Link>{" "}
                </span>
              </p>
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="termsAccepted"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                </div>

                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-dark text-gray-800">
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-xs">
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Signup
              </button>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-gray-200 h-screen flex justify-center items-center">
          <div className="sm:max-w-lg w-full">
            <div className="font-bold text-2xl">
              "The customer service is amazing. I can't wait to buy more. The
              support team went above and beyond to help me. I am very happy
              with the results. I will definitely recommend this to my friends."
            </div>
            <div className="pt-5 font-medium text-xl">Mr Xyz</div>
            <div className="text-sm opacity-35">CEO, XYZ company</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
