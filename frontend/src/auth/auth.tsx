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
import { Loader2Icon, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    <Card className="w-96 glass border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />
      
      <CardHeader>
        <CardTitle className="text-3xl font-semibold tracking-tight text-center">
          {usecase === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center text-white/60">
          {usecase === "login" 
            ? "Enter your credentials to access your account" 
            : "Sign up to get started with our chat platform"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Username</FormLabel>
                      <FormControl>
                        <Input className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50" placeholder="Enter Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 pr-10" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter Password" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("profileImg") && (
                  <div className="flex items-center justify-center w-full mt-2">
                    <Avatar className="w-16 h-16 ring-2 ring-primary/50 ring-offset-2 ring-offset-background transition-all">
                      <AvatarImage src={imageUrl} className="object-cover" />
                    </Avatar>
                  </div>
                )}
                
                {usecase === "signup" && (
                  <FormField
                    control={form.control}
                    name="profileImg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Profile Image</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-black/20 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-md file:px-2 file:py-1 hover:file:bg-white/20 transition-all cursor-pointer"
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
                className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]"
                disabled={loading}
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
            <div className="mt-6 text-center text-sm text-white/60">
              {usecase === "signup" ? "Already have an account? " : "Don't have an account? "}
              <Link
                to={usecase === "signup" ? "/auth/login" : "/auth/signup"}
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
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
