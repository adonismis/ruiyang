type PolicyTopic = { title: string; note: string };

export const policyPresentation: Record<
  string,
  {
    icon: "shield" | "quality" | "leaf";
    number: string;
    shortTitle: string;
    topics: PolicyTopic[];
  }
> = {
  safety: {
    icon: "shield",
    number: "01",
    shortTitle: "安全",
    topics: [
      {
        title: "職業安全衛生理念",
        note: "公司職業安全衛生方針與適用範圍，待正式資料確認後公開。",
      },
      {
        title: "現場施工安全管理",
        note: "施工現場安全管理制度、執行流程與相關規範，待公司提供。",
      },
      {
        title: "安全教育與管理措施",
        note: "安全教育訓練內容與管理措施，將依公司確認資料更新。",
      },
    ],
  },
  quality: {
    icon: "quality",
    number: "02",
    shortTitle: "品質",
    topics: [
      {
        title: "品質管理理念",
        note: "公司品質政策、管理方針與適用範圍，待正式資料確認後公開。",
      },
      {
        title: "施工品質管理",
        note: "施工品質管理流程、執行責任與相關紀錄，待公司提供。",
      },
      {
        title: "材料檢驗與自主檢查",
        note: "材料檢驗程序、自主檢查制度與相關表單，將依公司確認資料更新。",
      },
    ],
  },
  responsibility: {
    icon: "leaf",
    number: "03",
    shortTitle: "永續",
    topics: [
      {
        title: "企業永續理念",
        note: "公司永續發展方向與相關方針，待正式資料確認後公開。",
      },
      {
        title: "員工安全與關懷",
        note: "員工安全、關懷措施與相關制度，待公司提供。",
      },
      {
        title: "環境保護與節能減碳",
        note: "環境保護與節能減碳方向，將依公司確認的實際措施更新。",
      },
    ],
  },
};
