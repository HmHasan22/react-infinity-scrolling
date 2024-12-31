"use client";
import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://bubbl.dev/api/reports?${new URLSearchParams({
          page: pageNumber,
          limit: 10,
        }).toString()}`,
      );
      const result = await response.json();

      if (result?.data?.length) {
        setData((prevData) => [...prevData, ...result.data]);
        setHasMore(result.data.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const lastItemRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Infinite Scroll Example</h1>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={item.unique_id}
            ref={index === data.length - 1 ? lastItemRef : null}
            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-lg">{item.unique_id}</p>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading more items...</span>
            </div>
          </div>
        )}

        {!hasMore && data.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            No more items to load
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-4 text-gray-500">No items found</div>
        )}
      </div>
    </div>
  );
}
