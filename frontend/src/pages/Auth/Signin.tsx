import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../utils/config";
import { toast, Toaster } from "sonner";

interface FormData {
  email: string;
  password: string;
}
const Signin = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
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
    const errors: Partial<FormData> = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {

      fetch(`${config.apiUrl}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
        .then(async (response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json().catch((err) => {
              throw new Error(`Failed to parse JSON: ${err.message}`);
            });
            return { data, status: response.status };
          } else {
            const text = await response.text();
            throw new Error(
              `Unexpected response content type: ${contentType}. Response: ${text}`
            );
          }
        })
        .then(({ data, status }) => {
          if (status !== 200) {
            throw new Error(data.error || "Unknown error occurred");
          }

          localStorage.setItem("token", data.token);

          toast.success("Login successful");

          if (data.token) {
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.log(error);
          setErrors({ password: "Invalid email or password" });

          toast.error("Invalid email or password");

          console.error("Login failed:", error);

        });

      setFormData({
        email: "",
        password: "",
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
              Login into your account
              <p className="text-sm py-2 font-normal tracking-tight">
                Dont have have an account?{" "}
                <span className="font-bold">
                  {" "}
                  <Link to={"/signup"}>Signup</Link>{" "}
                </span>
              </p>
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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

              <div className="flex items-start">
                <div className="ml-1 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-dark font-medium hover:underline text-gray-800"
                  >
                    <Link to={"#"}> Forgot password ? </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-gray-200 h-screen flex justify-center items-center">
          <div className="sm:max-w-lg w-full">
            <div className="font-bold text-2xl">
              "A great revolution starts with pen and paper, but a greater
              revolution begins with a single click of a button."
            </div>
            <div className="pt-5 font-medium text-xl">Mr X</div>
            <div className="text-sm opacity-35">CEO, X company</div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Signin;
