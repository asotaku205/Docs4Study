import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Platform Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Platform Name</label>
            <Input className="mt-1" defaultValue="Docs4Study" />
          </div>
          <div>
            <label className="text-sm font-medium">Support Email</label>
            <Input className="mt-1" defaultValue="support@docs4study.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea className="w-full h-24 border border-input rounded-md p-3 text-sm mt-1 resize-none" defaultValue="The ultimate platform for learning and sharing educational content." />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
