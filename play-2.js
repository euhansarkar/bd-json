const fs = require("fs");
const english = require("./data/english");
const bangla = require("./data/bangla");
const postcode = require("./data/postcodes.json");
const latlongDistrticts = require("./data/districts.json");

const enDivisions = english.divisions_en,
  enDistricts = english.districts_en,
  enUpazillas = english.upazillas_en,
  enUnions = english.unions_en;

const bnDivisions = bangla.divisions,
  bnDistricts = bangla.districts,
  bnUpazillas = bangla.upazillas,
  bnUnions = bangla.unions;

const arr = [];

for (let i = 0; i < enDivisions.length; i++) {
  // en
  let { title, value } = enDivisions[i];
  let getDistricts = enDistricts[value];

  // bn
  const { title: bnTitle, value: bnValue } = bnDivisions[i];
  const getBnDistricts = bnDistricts[value];

  // divisions
  const o1 = { name: title, bnTitle, districts: [] };

  for (let j = 0; j < getDistricts.length; j++) {
    // en
    const { title, value } = getDistricts[j];
    const getUpazillas = enUpazillas[value];

    //latlong adding
    const latLongs = latlongDistrticts?.districts?.find(
      (latLong) => latLong?.name?.toLowerCase() === title?.toLowerCase()
    );

    // bn
    const { title: bnTitle, value: bnValue } = getBnDistricts[j];
    const getBnUpazillas = bnUpazillas[value];

    // districts
    const o2 = {
      name: title,
      bnTitle,
      lat: latLongs?.lat,
      long: latLongs?.long,
      upazillas: [],
    };

    for (let k = 0; k < getUpazillas.length; k++) {
      // bn
      const { title, value } = getUpazillas[k];
      const getUnions = enUnions[value];

      // bn
      const { title: bnTitle, value: bnValue } = getBnUpazillas[k];
      const getBnUnions = bnUnions[value];

      //postoffice adding
      const posts = postcode?.postcodes
        ?.filter((post) => post?.upazila?.toLowerCase() === title.toLowerCase())
        ?.map((post) => {
          return { name: post?.postOffice, code: post?.postCode };
        });

      // unions
      const o3 = { name: title, bnTitle, posts, unions: [] };

      for (let l = 0; l < getUnions.length; l++) {
        // en
        const { title, value } = getUnions[l];

        // bn
        const bnTitle = getBnUnions[l]?.title;

        o3.unions.push({ name: title, bnTitle });
      }

      o2.upazillas.push(o3);
    }

    o1.districts.push(o2);
  }

  arr.push(o1);
}

const jsonString = JSON.stringify(arr, null, 2);

fs.writeFile("data.json", jsonString, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("JSON file created successfully!");
});

// console.log(`Updated`, latlongDistrticts?.districts);
