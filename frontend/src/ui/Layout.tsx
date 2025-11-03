import React from "react";
import { Box } from "@chakra-ui/react";
import { Header } from "./Header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <Box pt="80px">
        {children}
      </Box>
    </>
  );
};