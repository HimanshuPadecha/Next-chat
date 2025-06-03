import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { backendResponse } from "@/interfaces/backend-response";
import type { loginResponseInterface } from "@/interfaces/requestes.interfaces";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import { LocalStorage } from "@/utils/localstorage";
import { login, signup } from "@/utils/requests";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError, AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

interface authprops {
  usecase: "signup" | "login";
}

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  profileImg: z.instanceof(File).optional(),
});

const Auth = ({ usecase }: authprops) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (usecase === "signup") {
        if (!form.getValues("profileImg")) {
          toast.error("Please Select profile pic");
          return;
        }
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);
        if (data.profileImg) {
          formData.append("profileImg", data.profileImg);
        }
        await signup(formData);
      }
      const response: AxiosResponse<backendResponse<loginResponseInterface>> =
        await login({
          username: data.username,
          password: data.password,
        });
        console.log(response);
      const { accessToken } = response.data.response.data;

      LocalStorage.set("accessToken",accessToken)
      navigate("/")      
    } catch (error: AxiosError | any) {
      AxiosErrorHandler(error);
      LocalStorage.clear()
    } finally {
      setLoading(false);
    }
  }

  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-2xl">
          {usecase === "login" ? "Login" : "Signup"}
        </CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("profileImg") && (
                  <div className="flex items-center justify-center w-full mt-2">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={imageUrl} className="" />
                    </Avatar>
                  </div>
                )}
                {usecase === "signup" && (
                  <FormField
                    control={form.control}
                    name="profileImg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(file);
                                setImageUrl(URL.createObjectURL(file));
                              }
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
              >
                {loading ? (
                  <Loader2Icon className="size-5 animate-spin" />
                ) : usecase === "signup" ? (
                  "Signup"
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={usecase === "signup" ? "/auth/login" : "/auth/signup"}
                className="underline underline-offset-4"
              >
                {usecase === "signup" ? "Login" : "Signup"}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Auth;
