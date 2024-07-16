const Signup = () => {
  return (
    <>
      <div className="flex flex-row w-full h-full items-center justify-center ">
        <div className="w-1/2 bg-gray-150   flex items-center justify-center  ">
          <div className="sm:max-w-md w-full">
            <h1 className="  text-center text-2xl font-bold leading-tight tracking-wider text-gray-900 md:text-4xl ">
              Create an account
              <p className="text-sm py-2 font-normal tracking-tight">
                Already Have a account?{" "}
                <span className="   font-bold">Login</span>
              </p>
            </h1>
            <form className="space-y-4  md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="username"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-gray-900 "
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Confirm password
                </label>
                <input
                  type="confirm-password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 "
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-dark text-gray-800 ">
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline "
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Signup
              </button>
            </form>
          </div>
        </div>

        {/* ------------------------------------------------------------------------------ */}

        <div className="w-1/2  bg-gray-200 h-screen   flex justify-center items-center  ">
          <div className="sm:max-w-lg w-full  ">
            <div className=" font-bold text-2xl  ">
              "The customer service is amazing. I can't wait to buy more. The
              support team went above and beyond to help me. I am very happy
              with the results. I will definitely recommend this to my friends."
            </div>
            <div className=" pt-5 font-medium text-xl">Mr Xyz</div>
            <div className=" text-sm opacity-35">CEO, XYZ company</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
