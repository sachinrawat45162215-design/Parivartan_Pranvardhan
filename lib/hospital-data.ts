export interface Hospital {
  id: string;
  name: string;
  nameHi: string;
  type: "government" | "private" | "phc";
  address: string;
  addressHi: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface CityHospitals {
  city: string;
  cityHi: string;
  state: string;
  stateHi: string;
  hospitals: Hospital[];
}

export const cityWiseHospitals: CityHospitals[] = [
  {
    city: "Lucknow",
    cityHi: "\u0932\u0916\u0928\u0908",
    state: "Uttar Pradesh",
    stateHi: "\u0909\u0924\u094D\u0924\u0930 \u092A\u094D\u0930\u0926\u0947\u0936",
    hospitals: [
      {
        id: "lko1",
        name: "King George's Medical University",
        nameHi: "\u0915\u093F\u0902\u0917 \u091C\u0949\u0930\u094D\u091C \u092E\u0947\u0921\u093F\u0915\u0932 \u092F\u0942\u0928\u093F\u0935\u0930\u094D\u0938\u093F\u091F\u0940",
        type: "government",
        address: "Shah Mina Road, Chowk, Lucknow - 226003",
        addressHi: "\u0936\u093E\u0939 \u092E\u0940\u0928\u093E \u0930\u094B\u0921, \u091A\u094C\u0915, \u0932\u0916\u0928\u0908 - 226003",
        phone: "0522-2257540",
        latitude: 26.8575,
        longitude: 80.9165,
      },
      {
        id: "lko2",
        name: "Ram Manohar Lohia Hospital",
        nameHi: "\u0930\u093E\u092E \u092E\u0928\u094B\u0939\u0930 \u0932\u094B\u0939\u093F\u092F\u093E \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "government",
        address: "Vibhuti Khand, Gomti Nagar, Lucknow - 226010",
        addressHi: "\u0935\u093F\u092D\u0942\u0924\u093F \u0916\u0902\u0921, \u0917\u094B\u092E\u0924\u0940 \u0928\u0917\u0930, \u0932\u0916\u0928\u0908 - 226010",
        phone: "0522-2258643",
        latitude: 26.8506,
        longitude: 80.9917,
      },
      {
        id: "lko3",
        name: "Community Health Centre, Mohanlalganj",
        nameHi: "\u0938\u093E\u092E\u0941\u0926\u093E\u092F\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0947\u0902\u0926\u094D\u0930, \u092E\u094B\u0939\u0928\u0932\u093E\u0932\u0917\u0902\u091C",
        type: "phc",
        address: "Mohanlalganj, Lucknow - 227305",
        addressHi: "\u092E\u094B\u0939\u0928\u0932\u093E\u0932\u0917\u0902\u091C, \u0932\u0916\u0928\u0908 - 227305",
        phone: "0522-2611234",
        latitude: 26.7500,
        longitude: 80.8833,
      },
    ],
  },
  {
    city: "Patna",
    cityHi: "\u092A\u091F\u0928\u093E",
    state: "Bihar",
    stateHi: "\u092C\u093F\u0939\u093E\u0930",
    hospitals: [
      {
        id: "pat1",
        name: "Patna Medical College & Hospital",
        nameHi: "\u092A\u091F\u0928\u093E \u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u0949\u0932\u0947\u091C \u0914\u0930 \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "government",
        address: "Ashok Rajpath, Patna - 800004",
        addressHi: "\u0905\u0936\u094B\u0915 \u0930\u093E\u091C\u092A\u0925, \u092A\u091F\u0928\u093E - 800004",
        phone: "0612-2300343",
        latitude: 25.6180,
        longitude: 85.1631,
      },
      {
        id: "pat2",
        name: "Nalanda Medical College & Hospital",
        nameHi: "\u0928\u093E\u0932\u0902\u0926\u093E \u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u0949\u0932\u0947\u091C \u0914\u0930 \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "government",
        address: "Kankarbagh, Patna - 800026",
        addressHi: "\u0915\u0902\u0915\u0930\u092C\u093E\u0917, \u092A\u091F\u0928\u093E - 800026",
        phone: "0612-2350710",
        latitude: 25.5953,
        longitude: 85.1773,
      },
      {
        id: "pat3",
        name: "PHC Bihta",
        nameHi: "\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0947\u0902\u0926\u094D\u0930 \u092C\u093F\u0939\u091F\u093E",
        type: "phc",
        address: "Bihta, Patna - 801103",
        addressHi: "\u092C\u093F\u0939\u091F\u093E, \u092A\u091F\u0928\u093E - 801103",
        phone: "06135-242246",
        latitude: 25.5642,
        longitude: 84.8690,
      },
    ],
  },
  {
    city: "Jaipur",
    cityHi: "\u091C\u092F\u092A\u0941\u0930",
    state: "Rajasthan",
    stateHi: "\u0930\u093E\u091C\u0938\u094D\u0925\u093E\u0928",
    hospitals: [
      {
        id: "jai1",
        name: "SMS Medical College & Hospital",
        nameHi: "\u090F\u0938\u090F\u092E\u090F\u0938 \u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u0949\u0932\u0947\u091C \u0914\u0930 \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "government",
        address: "JLN Marg, Jaipur - 302004",
        addressHi: "\u091C\u0947\u090F\u0932\u090F\u0928 \u092E\u093E\u0930\u094D\u0917, \u091C\u092F\u092A\u0941\u0930 - 302004",
        phone: "0141-2518671",
        latitude: 26.8654,
        longitude: 75.8146,
      },
      {
        id: "jai2",
        name: "Jaipuria Hospital",
        nameHi: "\u091C\u092F\u092A\u0941\u0930\u093F\u092F\u093E \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "private",
        address: "Milap Nagar, Tonk Road, Jaipur - 302018",
        addressHi: "\u092E\u093F\u0932\u093E\u092A \u0928\u0917\u0930, \u091F\u094B\u0902\u0915 \u0930\u094B\u0921, \u091C\u092F\u092A\u0941\u0930 - 302018",
        phone: "0141-2710777",
        latitude: 26.8555,
        longitude: 75.7880,
      },
    ],
  },
  {
    city: "Bhopal",
    cityHi: "\u092D\u094B\u092A\u093E\u0932",
    state: "Madhya Pradesh",
    stateHi: "\u092E\u0927\u094D\u092F \u092A\u094D\u0930\u0926\u0947\u0936",
    hospitals: [
      {
        id: "bho1",
        name: "AIIMS Bhopal",
        nameHi: "\u090F\u092E\u094D\u0938 \u092D\u094B\u092A\u093E\u0932",
        type: "government",
        address: "Saket Nagar, Bhopal - 462020",
        addressHi: "\u0938\u093E\u0915\u0947\u0924 \u0928\u0917\u0930, \u092D\u094B\u092A\u093E\u0932 - 462020",
        phone: "0755-2672317",
        latitude: 23.2063,
        longitude: 77.4573,
      },
      {
        id: "bho2",
        name: "Hamidia Hospital",
        nameHi: "\u0939\u092E\u0940\u0926\u093F\u092F\u093E \u0905\u0938\u094D\u092A\u0924\u093E\u0932",
        type: "government",
        address: "Royal Market, Bhopal - 462001",
        addressHi: "\u0930\u0949\u092F\u0932 \u092E\u093E\u0930\u094D\u0915\u0947\u091F, \u092D\u094B\u092A\u093E\u0932 - 462001",
        phone: "0755-2540222",
        latitude: 23.2682,
        longitude: 77.4127,
      },
    ],
  },
  {
    city: "Varanasi",
    cityHi: "\u0935\u093E\u0930\u093E\u0923\u0938\u0940",
    state: "Uttar Pradesh",
    stateHi: "\u0909\u0924\u094D\u0924\u0930 \u092A\u094D\u0930\u0926\u0947\u0936",
    hospitals: [
      {
        id: "var1",
        name: "BHU Hospital (Sir Sunderlal Hospital)",
        nameHi: "\u092C\u0940\u090F\u091A\u092F\u0942 \u0905\u0938\u094D\u092A\u0924\u093E\u0932 (\u0938\u0930 \u0938\u0941\u0902\u0926\u0930\u0932\u093E\u0932 \u0905\u0938\u094D\u092A\u0924\u093E\u0932)",
        type: "government",
        address: "BHU Campus, Varanasi - 221005",
        addressHi: "\u092C\u0940\u090F\u091A\u092F\u0942 \u0915\u0948\u0902\u092A\u0938, \u0935\u093E\u0930\u093E\u0923\u0938\u0940 - 221005",
        phone: "0542-2307511",
        latitude: 25.2677,
        longitude: 82.9913,
      },
      {
        id: "var2",
        name: "District Hospital Varanasi",
        nameHi: "\u091C\u093F\u0932\u093E \u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0935\u093E\u0930\u093E\u0923\u0938\u0940",
        type: "government",
        address: "Kabir Chaura, Varanasi - 221001",
        addressHi: "\u0915\u092C\u0940\u0930 \u091A\u094C\u0930\u093E, \u0935\u093E\u0930\u093E\u0923\u0938\u0940 - 221001",
        phone: "0542-2502295",
        latitude: 25.3204,
        longitude: 83.0050,
      },
      {
        id: "var3",
        name: "PHC Cholapur",
        nameHi: "\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0947\u0902\u0926\u094D\u0930 \u091A\u094B\u0932\u093E\u092A\u0941\u0930",
        type: "phc",
        address: "Cholapur, Varanasi - 221108",
        addressHi: "\u091A\u094B\u0932\u093E\u092A\u0941\u0930, \u0935\u093E\u0930\u093E\u0923\u0938\u0940 - 221108",
        phone: "0542-2641234",
        latitude: 25.3750,
        longitude: 83.0500,
      },
    ],
  },
  {
    city: "Ranchi",
    cityHi: "\u0930\u093E\u0901\u091A\u0940",
    state: "Jharkhand",
    stateHi: "\u091D\u093E\u0930\u0916\u0902\u0921",
    hospitals: [
      {
        id: "ran1",
        name: "RIMS Ranchi",
        nameHi: "\u0930\u093F\u092E\u094D\u0938 \u0930\u093E\u0901\u091A\u0940",
        type: "government",
        address: "Bariatu, Ranchi - 834009",
        addressHi: "\u092C\u0930\u093F\u092F\u093E\u0924\u0942, \u0930\u093E\u0901\u091A\u0940 - 834009",
        phone: "0651-2542930",
        latitude: 23.3751,
        longitude: 85.3133,
      },
      {
        id: "ran2",
        name: "Sadar Hospital Ranchi",
        nameHi: "\u0938\u0926\u0930 \u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0930\u093E\u0901\u091A\u0940",
        type: "government",
        address: "Lalpur, Ranchi - 834001",
        addressHi: "\u0932\u093E\u0932\u092A\u0941\u0930, \u0930\u093E\u0901\u091A\u0940 - 834001",
        phone: "0651-2211000",
        latitude: 23.3579,
        longitude: 85.3229,
      },
    ],
  },
];

export const hospitalTypeConfig = {
  government: { labelEn: "Government", labelHi: "\u0938\u0930\u0915\u093E\u0930\u0940", color: "#2563EB", icon: "hospital-building" },
  private: { labelEn: "Private", labelHi: "\u0928\u093F\u091C\u0940", color: "#7C3AED", icon: "hospital" },
  phc: { labelEn: "PHC/CHC", labelHi: "\u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0947\u0902\u0926\u094D\u0930", color: "#059669", icon: "medical-bag" },
};
