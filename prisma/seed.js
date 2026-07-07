const prisma = require('../config/db');

async function main() {
  console.log('Clearing old data...');
  await prisma.moduleMaterialMesh.deleteMany();
  await prisma.moduleMaterial.deleteMany();
  await prisma.materialAsset.deleteMany();
  await prisma.material.deleteMany();
  await prisma.category.deleteMany();
  await prisma.construction.deleteMany();

  console.log('Seeding categories...');
  await prisma.category.createMany({
    data: [
  {
    "id": "f6780649-6027-4e20-905f-32c1f4b28565",
    "name": "Alat K3",
    "value": "k3",
    "type": "tool",
    "created_at": "2026-05-07T10:03:44.249Z"
  },
  {
    "id": "9b669924-70d1-4b9a-8d71-d40bac3dc5c7",
    "name": "Alat Teknis",
    "value": "teknis",
    "type": "tool",
    "created_at": "2026-05-07T10:03:44.249Z"
  },
  {
    "id": "6b93a8d3-8ef0-4b77-b8f7-ec8584ede77d",
    "name": "Pengukuran",
    "value": "pengukuran",
    "type": "tool",
    "created_at": "2026-05-07T10:03:44.249Z"
  },
  {
    "id": "619a9a52-9a07-4f14-b2f9-bc319cda7f6c",
    "name": "Perkakas",
    "value": "perkakas",
    "type": "tool",
    "created_at": "2026-05-18T09:57:46.727Z"
  },
  {
    "id": "b5cdb86b-5fea-490f-a034-7e20a0d378f1",
    "name": "APD",
    "value": "apd",
    "type": "tool",
    "created_at": "2026-05-18T09:57:51.859Z"
  },
  {
    "id": "2c444a18-6bf0-4ff5-a3f1-2fd5d9fde4cf",
    "name": "Alat ukur dan uji",
    "value": "alat-ukur-dan-uji",
    "type": "tool",
    "created_at": "2026-05-18T11:31:12.145Z"
  },
  {
    "id": "c9a8cba5-c656-42da-a229-35e4f82897c7",
    "name": "Lainnya",
    "value": "lainnya",
    "type": "tool",
    "created_at": "2026-06-29T03:05:13.708Z"
  },
  {
    "id": "c160e4a2-6928-429a-ac14-eba543a4b4c1",
    "name": "sdf",
    "value": "f6780649-sdf",
    "type": "tool",
    "created_at": "2026-06-30T03:16:01.367Z"
  },
  {
    "id": "318d04c7-657b-4315-9295-ed6e23312622",
    "name": "abc",
    "value": "abc",
    "type": "konstruksi",
    "created_at": "2026-06-30T03:39:33.910Z"
  },
  {
    "id": "5e4f0d92-51f9-4455-9851-a969ef92508d",
    "name": "SR",
    "value": "sr",
    "type": "material",
    "created_at": "2026-06-30T03:20:00.427Z"
  },
  {
    "id": "ef5f94e9-7b05-4784-aff3-f70041d0b793",
    "name": "SKUTR",
    "value": "skutr",
    "type": "material",
    "created_at": "2026-07-06T04:09:52.770Z"
  },
  {
    "id": "38eff1da-ed18-4143-960d-e920a839d9c6",
    "name": "SKTR",
    "value": "sktr",
    "type": "material",
    "created_at": "2026-07-06T04:10:19.740Z"
  },
  {
    "id": "ce6fee38-6d27-4222-9836-b5277cd7b935",
    "name": "SKUTM",
    "value": "skutm",
    "type": "material",
    "created_at": "2026-07-06T04:11:16.754Z"
  },
  {
    "id": "a4a316d8-b283-489d-b16a-973b1ea50dd7",
    "name": "SUTM",
    "value": "sutm",
    "type": "material",
    "created_at": "2026-07-06T04:02:32.961Z"
  },
  {
    "id": "ef985500-58b4-471d-a194-ca9c3e8d9ea4",
    "name": "SUTR",
    "value": "sutr",
    "type": "material",
    "created_at": "2026-07-06T04:12:25.829Z"
  },
  {
    "id": "4f2a65ac-9fe7-4ee4-aebd-48edabab4525",
    "name": "SKTM",
    "value": "sktm",
    "type": "material",
    "created_at": "2026-07-06T04:14:27.676Z"
  },
  {
    "id": "1387bea6-1db0-4150-a38c-7edfd66093d6",
    "name": "Gardu Beton",
    "value": "gardu-beton",
    "type": "material",
    "created_at": "2026-07-06T04:16:41.711Z"
  },
  {
    "id": "558508aa-7fa9-4dc9-831c-c746a1a796ba",
    "name": "Gardu Cantol",
    "value": "gardu-cantol",
    "type": "material",
    "created_at": "2026-07-06T04:16:20.081Z"
  },
  {
    "id": "5d571645-274c-4d1c-bd65-3ae9817fe36c",
    "name": "Gardu Portal",
    "value": "gardu-portal",
    "type": "material",
    "created_at": "2026-07-06T04:16:34.831Z"
  }
]
  });

  console.log('Seeding constructions...');
  await prisma.construction.createMany({
    data: [
  {
    "id": "7cae0720-ceac-458b-950c-b74b6396d76f",
    "name": "Distribusi",
    "slug": "distribusi",
    "level": 1,
    "module_type": "konstruksi",
    "description": "sa",
    "image": null,
    "parent_id": null,
    "created_at": "2026-07-02T03:58:41.418Z",
    "updated_at": null
  },
  {
    "id": "0986fa17-faf6-44c0-821c-f38ec3e330b3",
    "name": "SR",
    "slug": "sr",
    "level": 2,
    "module_type": "konstruksi",
    "description": "sambungan rumah",
    "image": null,
    "parent_id": "7cae0720-ceac-458b-950c-b74b6396d76f",
    "created_at": "2026-07-02T03:58:56.947Z",
    "updated_at": null
  },
  {
    "id": "bec048c7-935e-4fad-8121-8f12eba8c441",
    "name": "JTR",
    "slug": "jtr",
    "level": 2,
    "module_type": "konstruksi",
    "description": "jangan terlalu ribet",
    "image": null,
    "parent_id": "7cae0720-ceac-458b-950c-b74b6396d76f",
    "created_at": "2026-07-02T04:22:33.539Z",
    "updated_at": null
  },
  {
    "id": "1d30746d-11d9-46c1-b18e-b276685b2de7",
    "name": "SUTR",
    "slug": "sutr",
    "level": 3,
    "module_type": "konstruksi",
    "description": "sambungan untuk tulang rusuk",
    "image": null,
    "parent_id": "bec048c7-935e-4fad-8121-8f12eba8c441",
    "created_at": "2026-07-02T04:24:17.767Z",
    "updated_at": null
  },
  {
    "id": "1377d9ec-37f9-4e69-b5d4-7c7d79a5ecb4",
    "name": "SKUTR",
    "slug": "skutr",
    "level": 3,
    "module_type": "konstruksi",
    "description": "sekoteng untuk rakyat",
    "image": null,
    "parent_id": "bec048c7-935e-4fad-8121-8f12eba8c441",
    "created_at": "2026-07-02T04:35:48.897Z",
    "updated_at": null
  },
  {
    "id": "38932fe2-b0ee-4f0f-8b8f-3358c6396ad8",
    "name": "SKTR",
    "slug": "sktr",
    "level": 3,
    "module_type": "konstruksi",
    "description": "au ah",
    "image": null,
    "parent_id": "bec048c7-935e-4fad-8121-8f12eba8c441",
    "created_at": "2026-07-02T04:36:13.095Z",
    "updated_at": null
  },
  {
    "id": "9eaec154-4a09-450e-86b5-1b57f3a237b8",
    "name": "Pembangkit",
    "slug": "pembangkit",
    "level": 1,
    "module_type": "konstruksi",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-07-02T04:37:50.766Z",
    "updated_at": null
  },
  {
    "id": "b012a2ac-c0a2-4fbb-bb6c-eeeae7d83baa",
    "name": "Transmisi",
    "slug": "transmisi",
    "level": 1,
    "module_type": "konstruksi",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-07-02T04:38:07.759Z",
    "updated_at": null
  },
  {
    "id": "b8f1eaf1-2179-4f2c-92bf-743aa9234613",
    "name": "JTM",
    "slug": "jtm",
    "level": 2,
    "module_type": "konstruksi",
    "description": "jantung manusia",
    "image": null,
    "parent_id": "7cae0720-ceac-458b-950c-b74b6396d76f",
    "created_at": "2026-07-02T04:38:27.939Z",
    "updated_at": null
  },
  {
    "id": "75876919-407d-4b06-8d33-1aabc97ec247",
    "name": "SUTM",
    "slug": "sutm",
    "level": 3,
    "module_type": "konstruksi",
    "description": "satu untuk teman mu",
    "image": null,
    "parent_id": "b8f1eaf1-2179-4f2c-92bf-743aa9234613",
    "created_at": "2026-07-02T04:39:02.024Z",
    "updated_at": null
  },
  {
    "id": "24becabc-96cf-4190-9958-a5d8380ccb41",
    "name": "SKUTM",
    "slug": "skutm",
    "level": 3,
    "module_type": "konstruksi",
    "description": "seliter untuk tangki motor",
    "image": null,
    "parent_id": "b8f1eaf1-2179-4f2c-92bf-743aa9234613",
    "created_at": "2026-07-02T04:39:49.846Z",
    "updated_at": null
  },
  {
    "id": "2271c30f-421e-49b9-be6b-054640f918a0",
    "name": "SKTM",
    "slug": "sktm",
    "level": 3,
    "module_type": "konstruksi",
    "description": "suka kamu tapi malu",
    "image": null,
    "parent_id": "b8f1eaf1-2179-4f2c-92bf-743aa9234613",
    "created_at": "2026-07-02T04:40:25.685Z",
    "updated_at": null
  },
  {
    "id": "efbcdb62-ac49-4faa-9dd6-46ed9ec369b2",
    "name": "Gardu",
    "slug": "gardu",
    "level": 2,
    "module_type": "konstruksi",
    "description": "gardu di dadaku",
    "image": null,
    "parent_id": "7cae0720-ceac-458b-950c-b74b6396d76f",
    "created_at": "2026-07-02T04:40:51.249Z",
    "updated_at": null
  },
  {
    "id": "8b2a5ecc-4fce-47c3-9e5a-df6acf62e3bc",
    "name": "Gardu Beton",
    "slug": "gb",
    "level": 3,
    "module_type": "konstruksi",
    "description": "gg brayy",
    "image": null,
    "parent_id": "efbcdb62-ac49-4faa-9dd6-46ed9ec369b2",
    "created_at": "2026-07-02T04:41:48.109Z",
    "updated_at": null
  },
  {
    "id": "7fa4608f-af9f-471d-8a80-721aeb11680b",
    "name": "Gardu Cantol",
    "slug": "gc",
    "level": 3,
    "module_type": "konstruksi",
    "description": "gerak cepat",
    "image": null,
    "parent_id": "efbcdb62-ac49-4faa-9dd6-46ed9ec369b2",
    "created_at": "2026-07-02T04:41:07.695Z",
    "updated_at": null
  },
  {
    "id": "f3761fca-7280-42e7-848a-430ad19ceffc",
    "name": "Gardu Portal",
    "slug": "gp",
    "level": 3,
    "module_type": "konstruksi",
    "description": "ganti pp",
    "image": null,
    "parent_id": "efbcdb62-ac49-4faa-9dd6-46ed9ec369b2",
    "created_at": "2026-07-02T04:41:35.304Z",
    "updated_at": null
  }
]
  });

  console.log('Seeding materials...');
  await prisma.material.create({
    data: {
      ...{"id":"bca33bac-b553-4cfc-b4dc-96cabc3103b1","name":"Arm Tie","code":"SPLN","bgGradient":null,"description":"Arm Tie adalah komponen struktural berupa plat besi datar berbahan baja galvanis anti-karat. Fungsinya adalah sebagai penyangga atau penopang mekanis untuk palang silang (cross arm / travers) pada tiang listrik PLN. Alat ini dipasang menyudut untuk menghubungkan dan mendistribusikan beban dari cross arm ke badan tiang utama, sehingga palang silang tetap lurus, stabil, dan kokoh menahan beban berat dari isolator serta tarikan kabel konduktor.","image":"/uploads/images/1782701579165_81456.png","created_at":"2026-05-18T10:38:35.558Z","updated_at":"2026-07-07T11:03:05.339Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Arm Tie","file":"/uploads/assets-3d/1782700979310_46390.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"2ff422f4-82e7-4641-bfc5-248f705f557d","name":"Anchor Block","code":"SNI/SPLN","bgGradient":null,"description":"Anchor Block (Blok Angkur) merupakan struktur beton pracetak atau cor di tempat (cast-in-place) berbobot besar yang dirancang khusus untuk menahan gaya tarik (tensile force), gaya dorong (thrust force","image":"/uploads/images/1782701471125_50752.png","created_at":"2026-05-18T10:15:10.608Z","updated_at":"2026-07-07T11:03:38.552Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Anchor Block","file":"/uploads/assets-3d/1782701010640_15172.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"e9586f07-2253-4f41-8097-06b41f79dcb6","name":"Klem Tarik JTR (Dan Penggantung Klem Tarik)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397165008_38023.png","created_at":"2026-07-03T03:47:48.914Z","updated_at":"2026-07-07T11:06:05.086Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Klem Tarik JTR (Dan Penggantung Klem Tarik)","file":"/uploads/assets-3d/1783050468964_23180.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"ccaa9ab0-e2bb-4b6c-976f-f651de71a1c0","name":"Cap Pelindung + Pipa Galvanis","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783066526114_10367.png","created_at":"2026-07-03T03:30:36.753Z","updated_at":"2026-07-07T11:03:11.715Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Cap Pelindung (Full)","file":"/uploads/assets-3d/1783049436803_60573.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"5fd1c537-6875-45b4-ad5b-6e3bd3185efa","name":"Klem Kabel","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397443295_64823.png","created_at":"2026-07-03T03:42:48.722Z","updated_at":"2026-07-07T11:10:43.317Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Klem Kabel","file":"/uploads/assets-3d/1783050168787_98200.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"3d591a26-501f-43e3-8ee3-2c96ad1989d2","name":"Penggantung Klem Gantung","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397357727_23376.png","created_at":"2026-07-03T03:41:02.586Z","updated_at":"2026-07-07T11:09:17.786Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Penopang Klem Gantung","file":"/uploads/assets-3d/1783050062631_2753.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"06f214e0-5441-4b9c-8f49-f9f03f4bb7e6","name":"Cross Arm Clevis (Full)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059528033_2139.png","created_at":"2026-07-03T03:32:24.417Z","updated_at":"2026-07-07T11:00:35.775Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Cross Arm Clevis (Full)","file":"/uploads/assets-3d/1783049544591_26716.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"dd6eeeba-365e-4687-9509-d6fb5eb5f143","name":"Fisher","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783066589557_25696.png","created_at":"2026-07-03T03:32:47.753Z","updated_at":"2026-07-07T11:00:38.386Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Fisher","file":"/uploads/assets-3d/1783049567810_52058.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"3a177662-41d6-4e4a-af23-41e5f3975782","name":"Guy Wire Clamp Type C","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059625000_33244.png","created_at":"2026-07-03T03:35:51.154Z","updated_at":"2026-07-07T11:00:41.077Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"GW Clamp Type C","file":"/uploads/assets-3d/1783049751217_7210.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"f141e682-1d3a-4b1f-bec8-8a77de9e25ab","name":"Guy Wire Clamp Type B","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059677608_23364.png","created_at":"2026-07-03T03:36:42.256Z","updated_at":"2026-07-07T11:00:42.933Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"GW Clamp Type B","file":"/uploads/assets-3d/1783049802316_86418.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"a0c6a3a6-6256-43f4-bdfd-4560192673a8","name":"Isolator Tarik","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059782525_96029.png","created_at":"2026-07-03T03:38:00.959Z","updated_at":"2026-07-07T11:00:44.793Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Isolator Tarik","file":"/uploads/assets-3d/1783049881008_92076.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"7b3f68d2-71af-4d6a-a08e-59170e897627","name":"Isolator Tumpu","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059816850_19551.png","created_at":"2026-07-03T03:38:59.017Z","updated_at":"2026-07-07T11:00:46.911Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Isolator Tumpu","file":"/uploads/assets-3d/1783049939068_24513.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"ba286ecf-1d17-434f-afbd-5c0bcc1f541b","name":"Jointing Bimetal AL CU","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059883638_70758.png","created_at":"2026-07-03T03:40:18.105Z","updated_at":"2026-07-07T11:00:49.966Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Jointing Bimetal AL CU","file":"/uploads/assets-3d/1783050018282_98415.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"0b5afad3-91ab-4201-afca-4a318470a738","name":"Cable Tie","code":"IEC","bgGradient":null,"description":"Cable Tie adalah material pengikat serbaguna sekali pakai yang terbuat dari plastik nilon tangguh. Di lingkungan operasional PLN, alat ini dirancang khusus untuk penggunaan luar ruangan (outdoor). Fun","image":"/uploads/images/1782702014240_7251.png","created_at":"2026-05-18T10:48:21.549Z","updated_at":"2026-07-07T11:00:52.967Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"},{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Cable Ties","file":"/uploads/assets-3d/1779076101784_2831.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"1dcae40f-1393-4d1a-8f7e-cd996b009bb5","name":"Turn Backle Jug Jug (Kotak)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783052908334_40538.png","created_at":"2026-07-03T04:11:15.563Z","updated_at":"2026-07-07T11:00:58.704Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Turn Backle Jug Jug (Kotak)","file":"/uploads/assets-3d/1783051875680_98030.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"75b4d1d4-a2f2-47cd-adc8-618f95686866","name":"Jangkar 4 (Strain Hook)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783052974153_92838.png","created_at":"2026-07-03T04:10:39.328Z","updated_at":"2026-07-07T11:01:08.681Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Jangkar 4 (Strain Hook)","file":"/uploads/assets-3d/1783051839370_99012.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"50f7f4fd-16e9-43e1-9e86-86cf2175ba17","name":"Stopping Buckle","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783053126304_9602.png","created_at":"2026-07-03T04:09:51.098Z","updated_at":"2026-07-07T11:01:12.927Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Stopping Buckle","file":"/uploads/assets-3d/1783051791145_66812.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"6d035bbf-07d7-4027-a3bb-6725d9b67bb5","name":"Stainless Steel Strip","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783053202273_33656.png","created_at":"2026-07-03T04:09:27.670Z","updated_at":"2026-07-07T11:01:17.766Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Stainless Steel Strip","file":"/uploads/assets-3d/1783051767731_12345.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"91b723b1-4dab-4a47-9f55-9c639f9b865a","name":"Simpul Bracket","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059350568_60051.png","created_at":"2026-07-03T04:09:05.896Z","updated_at":"2026-07-07T11:01:28.261Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Simpul Bracket (untuk SUTM)","file":"/uploads/assets-3d/1783051745943_62751.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"d2e8c465-fa66-4367-bbaf-d793778aa204","name":"Schoon Cable 2 Pole (AL AL)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059388306_49446.png","created_at":"2026-07-03T04:08:13.302Z","updated_at":"2026-07-07T11:24:28.492Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Schoon Cable 2 Pole (AL AL)","file":"/uploads/assets-3d/1783051693346_72957.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"de868b4a-84ca-4434-a03f-d888d0d9daa2","name":"Bolt & Nut 400 Full Helix","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059936045_65874.png","created_at":"2026-07-03T03:50:44.714Z","updated_at":"2026-07-07T11:24:02.186Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Bolt & Nut 400 Full Helix","file":"/uploads/assets-3d/1783050644781_66325.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"98336419-10b0-450e-a687-45f1ac3cf1f9","name":"Pole Band Double Arm","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059515351_62939.png","created_at":"2026-07-03T04:06:34.002Z","updated_at":"2026-07-07T11:24:10.292Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Pole Band Double Arm","file":"/uploads/assets-3d/1783051594092_70555.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"e530a8c7-5b53-4110-acbf-9063a6c72c07","name":"Pole Band Double Rack","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059561855_58030.png","created_at":"2026-07-03T04:06:02.889Z","updated_at":"2026-07-07T11:24:22.851Z"},
      categories: {
        connect: [{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Pole Band Double Rack","file":"/uploads/assets-3d/1783051562960_95284.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"7a90f50a-65f6-4d78-920a-6cfceb6d7dc2","name":"Pole Band Single Rack","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059636352_24278.png","created_at":"2026-07-03T04:05:19.008Z","updated_at":"2026-07-07T11:01:45.090Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Pole Band Single Rack","file":"/uploads/assets-3d/1783051519080_34675.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"4891d16f-a11f-49d5-9f4f-7e1ceeddae64","name":"Pole Band Single Arm","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059687256_30056.png","created_at":"2026-07-03T04:04:48.008Z","updated_at":"2026-07-07T11:01:47.798Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Pole Band Single Arm","file":"/uploads/assets-3d/1783051488076_18712.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"a212159c-53ce-496b-bc4d-587f2363b830","name":"Pole Band Support Double Arm","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059721086_35859.png","created_at":"2026-07-03T04:01:50.031Z","updated_at":"2026-07-07T11:01:50.405Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Pole Band Support Double Arm","file":"/uploads/assets-3d/1783051412339_62883.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"b9591cd9-c0a2-423b-8a86-97ee14e0e37e","name":"Jointing Bimetal CU CU","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059855521_36624.png","created_at":"2026-07-03T03:39:38.323Z","updated_at":"2026-07-07T11:01:56.376Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Jointing Bimetal CU CU","file":"/uploads/assets-3d/1783049978372_18360.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"535adb88-0854-4d05-aa3b-080042b4719e","name":"Pipa Penanda","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059901769_42415.png","created_at":"2026-07-03T03:51:10.327Z","updated_at":"2026-07-07T11:01:59.077Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Pipa Penanda","file":"/uploads/assets-3d/1783050670381_96642.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"f3d370a6-f531-446b-8af0-dfce6a7b1dde","name":"Nut","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783060075956_76616.png","created_at":"2026-07-03T03:48:16.230Z","updated_at":"2026-07-07T11:26:45.743Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Nut","file":"/uploads/assets-3d/1783050496291_98303.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"9d6bac1b-1496-43b8-9bf8-d7798812f6e7","name":"Klem Ikat Tiang Type 1","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397475787_47329.png","created_at":"2026-07-03T03:42:24.074Z","updated_at":"2026-07-07T11:11:15.814Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Klem Ikat Tiang Type 1","file":"/uploads/assets-3d/1783050144135_66616.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"936181cb-d02d-4266-846a-99beb247fa3b","name":"Schoon Cable 1 Pole (CU CU)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059479900_67899.png","created_at":"2026-07-03T04:07:05.154Z","updated_at":"2026-07-07T11:23:44.270Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Schoon Cable 1 Pole (CU CU)","file":"/uploads/assets-3d/1783051625200_77381.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"bb292643-eaef-4322-be28-9dc5b6d5e011","name":"Pole Band Ornament","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059604270_21073.png","created_at":"2026-07-03T04:05:41.171Z","updated_at":"2026-07-07T11:23:51.220Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Pole Band Ornament","file":"/uploads/assets-3d/1783051541224_9545.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"d8b59c80-4179-4113-ad49-ede700e6a6b4","name":"Strain Clamp","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783053028120_52492.png","created_at":"2026-07-03T04:10:15.636Z","updated_at":"2026-07-07T11:02:28.521Z"},
      categories: {
        connect: [{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Strain Clamp (TM)","file":"/uploads/assets-3d/1783051815705_65566.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"8a914af1-7c73-44cf-8f85-14e9e46dde40","name":"Breeze","code":".","bgGradient":null,"description":"Breeze adalah komponen penyangga struktural berbentuk plat besi datar yang terbuat dari baja galvanis anti-karat. Fungsinya adalah sebagai penopang mekanis untuk menstabilkan palang silang (cross arm / travers) pada tiang listrik PLN. Alat ini dipasang secara diagonal untuk mendistribusikan beban dari cross arm ke badan tiang utama, sehingga posisi travers tidak miring dan tetap kokoh saat menahan berat isolator serta tarikan kabel konduktor.","image":"/uploads/images/1783059437737_76800.png","created_at":"2026-07-03T03:29:40.724Z","updated_at":"2026-07-07T11:02:31.594Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Breeze","file":"/uploads/assets-3d/1783049380783_27550.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"7f24e49d-eb4b-490f-873c-17701488a0ac","name":"Pole Band Umum","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059851738_33318.png","created_at":"2026-07-03T03:51:31.193Z","updated_at":"2026-07-07T11:23:54.573Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Pole Band Umum","file":"/uploads/assets-3d/1783050691276_46483.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"fc4a62de-d0a8-4830-8d15-a48219b1c0a8","name":"Guy Wire Clamp Type A","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059756549_66302.png","created_at":"2026-07-03T03:37:32.190Z","updated_at":"2026-07-07T11:02:48.207Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"GW Clamp Type A","file":"/uploads/assets-3d/1783049852236_4813.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"258687db-7f18-4530-9aa3-e8f8f256ded3","name":"Jointing Bimetal AL AL","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059910703_49424.png","created_at":"2026-07-03T03:40:38.140Z","updated_at":"2026-07-07T11:02:50.724Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Jointing Bimetal AL AL","file":"/uploads/assets-3d/1783050038198_60815.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"b9d69f8c-e382-41d5-a738-2bbea49faf0c","name":"Arrester","code":"SPLN/IEC","bgGradient":null,"description":"Arrester adalah peralatan proteksi atau pengaman pada jaringan listrik PLN yang berfungsi untuk melindungi peralatan kelistrikan utama (seperti transformator distribusi) dari kerusakan akibat lonjakan","image":"/uploads/images/1782701534399_6187.png","created_at":"2026-05-18T10:40:42.451Z","updated_at":"2026-07-07T11:02:52.921Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"}]
      },
      assets: {
        create: [{"name":"Arrester","file":"/uploads/assets-3d/1779075642369_46575.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"5ce3b952-e160-4160-a968-5cc213ed3982","name":"Klem Ikat Tiang Type 2","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783060110503_82941.png","created_at":"2026-07-03T03:42:04.573Z","updated_at":"2026-07-07T11:02:55.070Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Klem Ikat Tiang Type 2","file":"/uploads/assets-3d/1783050124621_95779.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"dff1e365-487a-4f3e-b194-9529135b676c","name":"Penggantung Klem Tarik","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397536989_27562.png","created_at":"2026-07-03T03:46:49.498Z","updated_at":"2026-07-07T11:12:17.045Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Penggantung Klem Tarik","file":"/uploads/assets-3d/1783050409558_9706.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"973ef2c6-d2b5-482f-909e-b430709b6cbb","name":"Connector Press","code":"SPLN","bgGradient":null,"description":"Connector Press (sering disebut Compression Connector, Joint Sleeve Press, atau Konektor CCO) adalah material penyambung kelistrikan berbahan logam konduktif tinggi (seperti aluminium murni, bimetal, atau tembaga). Fungsinya adalah untuk menyambungkan dua kabel penghantar (konduktor) secara permanen, baik untuk sambungan lurus (sambungan antar ujung kabel) maupun percabangan (seperti T-Tap atau H-Tap). Proses pemasangan material ini wajib menggunakan alat press mekanis atau hidrolik (crimping tool) untuk memadatkan bodi konektor hingga menjepit kabel dengan sangat kuat. Metode press ini bertujuan untuk menyatukan konduktor secara sempurna guna memastikan aliran arus listrik yang optimal dan mencegah timbulnya titik panas (hotspot) akibat sambungan yang longgar.","image":"/uploads/images/1782701642446_58586.png","created_at":"2026-05-18T10:59:38.882Z","updated_at":"2026-07-06T13:58:20.493Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"},{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Connector Press (tanpa pelindung)","file":"/uploads/assets-3d/1779076778756_91867.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"22f933c1-ec7f-47fd-9f43-795855d852b2","name":"Wire Clip (Full)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783052828731_26171.png","created_at":"2026-07-03T04:12:14.650Z","updated_at":"2026-07-06T14:01:10.872Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Wire Clip (Full)","file":"/uploads/assets-3d/1783051934716_76473.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"cae3b271-4254-43fd-a06b-2b7bc5d6c032","name":"Guy Wire Insulator","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059592891_72781.png","created_at":"2026-07-03T03:33:25.620Z","updated_at":"2026-07-06T14:13:38.225Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Guy Wire Insulator","file":"/uploads/assets-3d/1783049605680_52073.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"8eabb26d-cb41-4a5f-a08e-02ad83fadeb3","name":"Pole Band Support Single Arm","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059815955_17638.png","created_at":"2026-07-03T03:52:14.460Z","updated_at":"2026-07-06T14:18:36.356Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Pole Band Support Single Arm","file":"/uploads/assets-3d/1783050734526_55461.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"f2720a93-a48c-4314-a5c7-2c08547f9dbb","name":"Cousen or Timble","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059495691_17029.png","created_at":"2026-07-03T03:31:36.173Z","updated_at":"2026-07-07T08:09:53.375Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Cousen or Timble","file":"/uploads/assets-3d/1783049496223_48072.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"1af63fed-e22d-4e63-a13b-9efdf0f908b4","name":"Clamp Beugel U","code":"SPLN","bgGradient":null,"description":"Clamp Beugel U (di lapangan sering disebut Klem U, U-Bolt, atau Beugel tiang) adalah perangkat keras mekanikal berbentuk huruf \"U\" yang memiliki ulir sekrup pada kedua ujungnya. Dalam konstruksi jaringan JTM/JTR PLN, material berbahan baja galvanis ini berfungsi untuk menjepit, mengikat, dan mengunci palang silang (cross arm / travers) atau aksesoris jaringan lainnya secara erat ke tiang listrik (baik pada tiang beton maupun tiang besi). Beugel U selalu dipasang satu set bersama plat penahan dan mur pengunci untuk memastikan struktur tiang dan travers terpasang kokoh, tidak bergeser, dan mampu menahan beban mekanis dari tarikan konduktor.","image":"/uploads/images/1782701718221_44503.png","created_at":"2026-05-18T10:57:21.582Z","updated_at":"2026-07-06T13:47:17.780Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Clamp Beugel U","file":"/uploads/assets-3d/1779076641501_20694.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"35488f21-83b2-44be-b0d3-677cc68e5ac5","name":"Cap Pelindung","code":"SPLN","bgGradient":null,"description":"Cap Pelindung adalah komponen penutup yang dipasang pada ujung paling atas tiang listrik jaringan distribusi (baik pada tiang baja/besi tubular maupun tiang beton). Fungsi utamanya adalah untuk menyegel dan menutup lubang puncak tiang agar tidak kemasukan air hujan, kotoran, atau menjadi tempat bersarang hewan (seperti burung atau serangga). Perlindungan ini sangat krusial, terutama pada tiang besi, karena air yang masuk dan menggenang di dalam rongga tiang dapat memicu korosi (karat) internal yang akan melemahkan kekuatan struktural tiang penopang JTM/JTR secara fatal.","image":"/uploads/images/1783066500419_85374.png","created_at":"2026-05-18T10:55:21.407Z","updated_at":"2026-07-06T13:48:25.548Z"},
      categories: {
        connect: [{"id":"5e4f0d92-51f9-4455-9851-a969ef92508d"}]
      },
      assets: {
        create: [{"name":"Cap Pelindung bagian atas","file":"/uploads/assets-3d/1779076521339_17676.glb"},{"name":"Cap Pelindung Full","file":"/uploads/assets-3d/1779076522747_90314.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"752be319-cb3c-484f-ae82-a1ee492e3172","name":"Anchor Rod","code":"SNI/ASTM","bgGradient":null,"description":"Anchor rod (batang angkur / anchor bolt) merupakan sebatang logam silinder pejal panjang yang dilengkapi ulir sekrup (threading) presisi pada salah satu atau kedua ujungnya, serta sering kali didesain dengan ujung bawah berbentuk bengkok (L/J-shaped), lurus berpiringan (headed/plate), maupun berulir penuh (fully threaded). Fitur teknis ini berfungsi murni untuk menyalurkan beban mekanis—baik gaya tarik (tensile load), gaya geser (shear load), maupun gaya angkat (uplift forces)—dari komponen struktur di atas permukaan (seperti kolom baja jembatan, tiang listrik PLN, papan reklame jalan, hingga sambungan kawat sking/guy wire) ke dalam pondasi beton keras atau lapisan jangkar tanah di bawahnya agar struktur tetap berdiri tegak, stabil, dan tidak roboh.","image":"/uploads/images/1782702225069_31877.png","created_at":"2026-05-18T10:21:36.028Z","updated_at":"2026-07-07T11:00:55.445Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"}]
      },
      assets: {
        create: [{"name":"Anchor Rod","file":"/uploads/assets-3d/1779074496005_76308.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"ed637d90-2516-4cb7-888b-df5a55308224","name":"Klem Gantung","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783397637195_55231.png","created_at":"2026-07-03T03:41:27.182Z","updated_at":"2026-07-07T11:13:57.216Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"}]
      },
      assets: {
        create: [{"name":"Klem Gantung","file":"/uploads/assets-3d/1783050087276_91299.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"ae5070ab-9996-4512-8fae-0daccd8b277b","name":"Anchor Expandable","code":"SPLN/ASTM","bgGradient":null,"description":"","image":"/uploads/images/1783397687929_56566.png","created_at":"2026-07-03T03:28:54.683Z","updated_at":"2026-07-07T11:14:47.958Z"},
      categories: {
        connect: [{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"}]
      },
      assets: {
        create: [{"name":"Terbuka","file":"/uploads/assets-3d/1783049334748_22136.glb"},{"name":"Tertutup","file":"/uploads/assets-3d/1783395233025_40426.glb"},{"name":"contoh gambar","file":"/uploads/assets-3d/1783396470184_74533.png"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"83e3e7b9-d7d0-4b27-a009-2cb695af38ba","name":"Washer","code":".","bgGradient":null,"description":"40x 18","image":"/uploads/images/1783052877301_49724.png","created_at":"2026-07-03T04:11:45.363Z","updated_at":"2026-07-07T11:24:38.964Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Washer 40x 18","file":"/uploads/assets-3d/1783051905409_83551.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"dda2745c-1215-4c46-bd1f-ba0c9cd2767d","name":"Bolt","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783060052021_3018.png","created_at":"2026-07-03T03:48:52.643Z","updated_at":"2026-07-07T11:27:21.964Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Bolt","file":"/uploads/assets-3d/1783050532695_62967.glb"}]
      }
    }
  });
  await prisma.material.create({
    data: {
      ...{"id":"22f33ecd-04af-44b0-8d79-8a50d7ee3787","name":"Schoon Cable 2 Pole (AL CU)","code":".","bgGradient":null,"description":"","image":"/uploads/images/1783059421134_21449.png","created_at":"2026-07-03T04:07:46.980Z","updated_at":"2026-07-07T11:27:42.475Z"},
      categories: {
        connect: [{"id":"ef5f94e9-7b05-4784-aff3-f70041d0b793"},{"id":"38eff1da-ed18-4143-960d-e920a839d9c6"},{"id":"ce6fee38-6d27-4222-9836-b5277cd7b935"},{"id":"a4a316d8-b283-489d-b16a-973b1ea50dd7"},{"id":"ef985500-58b4-471d-a194-ca9c3e8d9ea4"},{"id":"4f2a65ac-9fe7-4ee4-aebd-48edabab4525"},{"id":"1387bea6-1db0-4150-a38c-7edfd66093d6"},{"id":"558508aa-7fa9-4dc9-831c-c746a1a796ba"},{"id":"5d571645-274c-4d1c-bd65-3ae9817fe36c"}]
      },
      assets: {
        create: [{"name":"Schoon Cable 2 Pole (AL CU)","file":"/uploads/assets-3d/1783051667027_42019.glb"}]
      }
    }
  });

  console.log('Seed completed successfully!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
