import { NEXT_PUBLIC_API_URL } from "@/commons/constants";
import DeleteModal from "@/components/DeleteModal";
import { Item } from "@/types/item";
import {
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/v1/items`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`${NEXT_PUBLIC_API_URL}/v1/items/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      await fetchData();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Heading>配信予約一覧</Heading>
      <Link href="/create">
        <Button colorScheme="teal" my={4}>
          Create New Item
        </Button>
      </Link>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>UID</Th>
            <Th>Message</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.uid}</Td>
              <Td>{item.messageJson}</Td>
              <Td>{item.sentDate}</Td>
              <Td>{item.isSent ? "送信済み" : "未送信"}</Td>
              <Td>
                <Link href={`/update/${item.id}`}>
                  <Button colorScheme="teal">編集</Button>
                </Link>
              </Td>
              <Td>
                <DeleteModal
                  isLoading={isLoading}
                  onDelete={() => handleDelete(item.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
