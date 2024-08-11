import LoginForm from "../components/Login/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row xl:space-x-4 3xl:space-x-8 md:py-2 md:px-2 lg:px-3 lg:py-3 xl:px-4 xl:py-4 2xl:px-16 2xl:py-8 3xl:px-20 3xl:py-8 4xl:px-28 4xl:py-20 min-h-screen">
      <div className="bg-primary rounded-[50px] w-1/2 m-2 hidden md:flex items-center relative bg-gradient-to-br from-white/40 via-transparent to-transparent">
        <div className="w-10/12 xl:w-9/12 3xl:10/12 ml-6 xl:ml-12">
          <div className="w-10/12 xl:w-9/12 3xl:10/12 ml-6 xl:ml-12">
            <h1 className="text-4xl md:text-5xl xl:text- 2xl:text-6xl 3xl:text-7xl text-white font-medium ">
              Connecting Past, Present and Future.
            </h1>
            <br />
            <br />
            <h3 className="text-xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold text-white">
              Where Memories Live On
            </h3>
          </div>
        </div>
      </div>

      <div className="flex-grow m-2">
        <LoginForm />
      </div>
    </div>
  );
}
