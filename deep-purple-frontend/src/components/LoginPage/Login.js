import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginRegister() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card className="h-[310px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              For all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Username</Label>
              <Input id="name" />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input id="username" type="password" />
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card className="h-[310px]">
          <CardHeader>
            <CardTitle>Register Account</CardTitle>
            <CardDescription>
              If you do not have an account, register here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Username</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter className="justify-center ">
            <Button>Register</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
