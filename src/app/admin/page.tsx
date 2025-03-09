"use client";

import { useEffect, useState } from "react";
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
import { useLogin } from "@/hooks/useLogin";

export default function AdminPage() {
  const [isOpened, setIsOpened] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState(
    localStorage.getItem("admin-password") ?? ""
  );

  const handlePasswordSubmit = async () => {
    const result = await useLogin(password);
    if (result.success) {
      setIsOpened(false);
      setIsSuccess(true);
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!isSuccess && !isOpened) window.location.href = "/";
  }, [isOpened, isSuccess]);

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
      {!isOpened && isSuccess && (
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
