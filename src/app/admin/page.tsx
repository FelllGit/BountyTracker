"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminBugBountyTable from "@/components/admin/bugBunty/BugBounty";
import AdminCrowdsourcedAudits from "@/components/admin/crowdsourcedAudits /CrowdsourcedAudits";

export default function AdminPage() {
  const [isOpened, setIsOpened] = useState(true);
  const [password, setPassword] = useState("");

  const STORED_HASHED_PASSWORD =
    "$2a$10$e79LOD1ugUnr.ae/jSgX4.v4yuDX7GcRbiDdfhVwXhqnGvJ.PzHfy";

  const handlePasswordSubmit = () => {
    const isValidPassword = bcrypt.compareSync(
      password,
      STORED_HASHED_PASSWORD
    );

    if (isValidPassword) {
      setIsOpened(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <Dialog open={isOpened} onOpenChange={setIsOpened}>
        <DialogContent
          draggable={false}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="mb-2">Enter password</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-fit"
                variant="secondary"
                onClick={handlePasswordSubmit}
              >
                Submit
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {!isOpened && (
        <Tabs defaultValue="ca" className="">
          <TabsList>
            <TabsTrigger value="ca">Crowdsourced Audits</TabsTrigger>
            <TabsTrigger value="bb">Bug Bounties</TabsTrigger>
          </TabsList>
          <TabsContent value="bb">
            <AdminBugBountyTable />
          </TabsContent>
          <TabsContent value="ca">
            <AdminCrowdsourcedAudits />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
