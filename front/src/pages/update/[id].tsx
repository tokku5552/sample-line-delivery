import { NEXT_PUBLIC_API_URL } from "@/commons/constants";
import { Item } from "@/types/item";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type UpdateFormData = {
  uid: string;
  messageJson: string;
  sentDate: string;
};

export default function UpdatePage() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState<Item>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_URL}/v1/items/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setItem(response.data.item);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchData();
  }, [id]);

  const { handleSubmit, register, formState } = useForm<UpdateFormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const response = await axios.put(
        `${NEXT_PUBLIC_API_URL}/v1/items/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      router.push("/");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <>
      <Heading>更新ページ</Heading>
      <Box mt="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="uid" isRequired>
            <FormLabel>UID</FormLabel>
            <Input
              id="uid"
              defaultValue={item?.uid}
              {...register("uid", { required: true })}
            />
            <FormErrorMessage>
              {formState.errors.uid && "UID is required"}
            </FormErrorMessage>
          </FormControl>

          <FormControl id="messageJson" mt="4" isRequired>
            <FormLabel>Message JSON</FormLabel>
            <Input
              id="messageJson"
              defaultValue={item?.messageJson}
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
              defaultValue={item?.sentDate}
              {...register("sentDate", { required: true })}
            />
            <FormErrorMessage>
              {formState.errors.messageJson && "Message JSON is required"}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt="4"
            colorScheme="teal"
            isLoading={formState.isSubmitting}
            type="submit"
          >
            更新
          </Button>
        </form>
      </Box>
    </>
  );
}
