const fs = require("fs");
const english = require("./data/english");
const bangla = require("./data/bangla");

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

    // bn
    const { title: bnTitle, value: bnValue } = getBnDistricts[j];
    const getBnUpazillas = bnUpazillas[value];

    // districts
    const o2 = { name: title, bnTitle, upazillas: [] };

    for (let k = 0; k < getUpazillas.length; k++) {
      // bn
      const { title, value } = getUpazillas[k];
      const getUnions = enUnions[value];

      // bn
      const { title: bnTitle, value: bnValue } = getBnUpazillas[k];
      const getBnUnions = bnUnions[value];

      // unions
      const o3 = { name: title, bnTitle, unions: [] };

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

// for (const division of enDivisions) {
//   const { title: divisionName, value: divisionValue } = division;
//   const districts = enDistricts[divisionValue];

//   const object1 = { name: divisionName, divisions: [] };

//   for (const district of districts) {
//     const { title: districtName, value: districtValue } = district;
//     const upazillas = enUpazillas[districtValue];

//     const object2 = { name: districtName, upazillas: [] };

//     for (const upazilla of upazillas) {
//       const { title: upazillaName, value: upazillaValue } = upazilla;
//       const unions = enUnions[upazillaValue];

//       const object3 = { name: upazillaName, unions };
//       for(const union of unions){
//         const union = enUnions[unionValue];
//       }

//       object2.upazillas.push(object3);
//     }

//     object1.divisions.push(object2);
//   }

//   arr.push(object1);
// }

const jsonString = JSON.stringify(arr, null, 2);

fs.writeFile("data.json", jsonString, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("JSON file created successfully!");
});
