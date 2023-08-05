import { Button } from "@/components/ui/button";
import supabase from "./utils/supabase";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import { Upvote } from "./upvote";

export default async function Home() {
  const { data: readings } = await supabase
    .from("readings")
    .select("id, title, url, upvotes")
    .match({ is_read: false })
    .order("upvotes", { ascending: false });

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const { title, url } = Object.fromEntries(formData.entries());

    await supabase.from("readings").insert({ title, url }).select();

    revalidatePath("/");
  };

  const markAsRead = async (formData: FormData) => {
    "use server";

    const { id } = Object.fromEntries(formData.entries());
    await supabase
      .from("readings")
      .update({ is_read: true })
      .match({ id })
      .select();

    revalidatePath("/");
  };

  const defaultAction = async () => {
    "use server";

    console.log("from default action");
  };

  const handleUpVote = async (id: string) => {
    "use server";

    console.log(id);

    await supabase.rpc("upvotes", { id });
    revalidatePath("/");
  };
  return (
    <div className="flex flex-col py-4 px-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Readings
      </h1>

      <div className="my-4 flex flex-col gap-4">
        {readings?.map((reading) => (
          <Card key={reading.id}>
            <CardHeader>
              <CardTitle>{reading.title}</CardTitle>
              <div className="flex gap-2">
                {reading.title}
                <form action={defaultAction}>
                  <input type="hidden" name="id" value={reading?.id} />
                  <button formAction={markAsRead}>✅</button>
                  {/*  <Button type="submit">Save</Button> */}
                </form>
                <Upvote
                  id={reading.id}
                  upvotes={reading.upvotes}
                  onUpVote={handleUpVote}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div>
        <form className="mt-8 flex flex-col space-y-3" action={handleSubmit}>
          <Input type="text" name="title" className="py-6" />
          <Input type="url" name="url" className="py-6" />
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
}
