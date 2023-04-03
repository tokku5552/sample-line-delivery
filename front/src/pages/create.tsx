import { NEXT_PUBLIC_API_URL } from "@/commons/constants";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type CreateFormData = {
  uid: string;
  messageJson: string;
  sentDate: string;
};

export default function CreatePage() {
  const router = useRouter();

  const { handleSubmit, register, formState } = useForm<CreateFormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: CreateFormData) => {
    try {
      await axios.post(`${NEXT_PUBLIC_API_URL}/v1/items`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  return (
    <>
      <Heading>新規作成ページ</Heading>
      <Box mt="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="uid" isRequired>
            <FormLabel>UID</FormLabel>
            <Input id="uid" {...register("uid", { required: true })} />
            <FormErrorMessage>
              {formState.errors.uid && "UID is required"}
            </FormErrorMessage>
          </FormControl>

          <FormControl id="messageJson" mt="4" isRequired>
            <FormLabel>Message JSON</FormLabel>
            <Input
              id="messageJson"
              {...register("messageJson", { required: true })}
            />
            <FormErrorMessage>
              {formState.errors.messageJson && "Message JSON is required"}
            </FormErrorMessage>
          </FormControl>

          <FormControl id="sentDate" mt="4" isRequired>
            <FormLabel>送信日</FormLabel>
            <Input
              id="sentDate"
              {...register("sentDate", { required: true })}
            />
            <FormErrorMessage>
              {formState.errors.messageJson && "Message JSON is required"}
            </FormErrorMessage>
          </FormControl>
          <ButtonGroup mt="4">
            <Button mt="4" colorScheme="teal" onClick={() => router.push("/")}>
              戻る
            </Button>
            <Button
              mt="4"
              colorScheme="teal"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              新規作成
            </Button>
          </ButtonGroup>
        </form>
      </Box>
    </>
  );
}
