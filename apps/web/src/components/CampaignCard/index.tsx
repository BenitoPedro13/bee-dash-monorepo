"use client"

import React from 'react';
import useDataStore from "@/store";

export default function CampaingCard () {
  const { color } = useDataStore((store) => store.session.user)

  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;

  const categories = [
    {id: 1, name: "Carros"},
    {id: 2, name: "Lifestyle"}
  ];

  return (
    <div className="bg-white rounded-xl border border-[#D4D4D4]">  
      <div className="p-6">
        <div className="flex justify-start content-start gap-2 pb-3.5">
          {categories.map((cat) => (
            <p 
              key={cat.id} 
              className="text-xs text-white font-semibold py-0.5 px-2.5 rounded-full"
              style={{backgroundColor: hexColor /*Add cor de acordo com a escolha*/}}
            >
              {cat.name}
            </p>
          ))}
        </div>
        <h2 className="text-2xl text-[#101828] font-nexa font-bold">Rolê em SP</h2>
      </div> 
    </div>
  );
}