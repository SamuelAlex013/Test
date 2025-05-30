
"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button"
; // Example using MUI, update as needed

export default function ClientNavButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/query"); 
  };

  return <Button onClick={handleClick}>Go to Query Page</Button>;
}
