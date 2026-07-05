import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    CheckCircle,
    Edit2,
    Save,
    X,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
  "1 Peter 5:8": {
    "KJV": "8 Be sober, be vigilant; because your adversary the devil, as a roaring lion, walketh about, seeking whom he may devour:",
    "NKJV": "8 Be sober, be vigilant; because your adversary the devil walks about like a roaring lion, seeking whom he may devour.",
    "NIV": "8 Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.",
    "ESV": "8 Be sober-minded; be watchful. Your adversary the devil prowls around like a roaring lion, seeking someone to devour.",
    "AMP": "8 Be sober [well balanced and self-disciplined], be vigilant and cautious at all times; that enemy of yours, the devil, prowls around like a roaring lion [fiercely hungry], seeking someone to devour.",
    "NLT": "8 Stay alert! Watch out for your great enemy, the devil. He prowls around like a roaring lion, looking for someone to devour."
  },
  "1 Samuel 13:16-22": {
    "KJV": "16 And Saul, and Jonathan his son, and the people that were present with them, abode in Gibeah of Benjamin: but the Philistines encamped in Michmash. 17 And the spoilers came out of the camp of the Philistines in three companies: one company turned unto the way that leadeth to Ophrah, unto the land of Shual: 18 And another company turned the way to Bethhoron: and another company turned to the way of the border that looketh to the valley of Zeboim toward the wilderness. 19 Now there was no smith found throughout all the land of Israel: for the Philistines said, Lest the Hebrews make them swords or spears: 20 But all the Israelites went down to the Philistines, to sharpen every man his share, and his coulter, and his ax, and his mattock. 21 Yet they had a file for the mattocks, and for the coulters, and for the精神, and for the axes, and to sharpen the goads. 22 So it came to pass in the day of battle, that there was neither sword nor spear found in the hand of any of the people that were with Saul and Jonathan: but with Saul and with Jonathan his son was there found.",
    "NKJV": "16 Saul, Jonathan his son, and the people present with them remained in Gibeah of Benjamin. But the Philistines encamped in Michmash. 17 Then raiders came out of the camp of the Philistines in three companies. One company turned onto the road to Ophrah, to the land of Shual, 18 another company turned toward the road to Beth Horon, and another company turned to the road of the border that overlooks the Valley of Zeboim toward the wilderness. 19 Now there was no blacksmith to be found throughout all the land of Israel, for the Philistines said, “Lest the Hebrews make swords or spears.” 20 But all the Israelites would go down to the Philistines to sharpen each man’s plowshare, his mattock, his ax, and his sickle; 21 and the charge was a pim for the plowshares, the mattocks, the three-pronged forks, and the axes, and to sharpen the goads. 22 So it came to pass, on the day of battle, that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan. But they were found with Saul and Jonathan his son.",
    "NIV": "16 Saul and his son Jonathan and the men with them were staying in Gibeah in Benjamin, while the Philistines camped at Michmash. 17 Raiding parties went out from the Philistine camp in three detachments. One turned toward Ophrah in the vicinity of Shual, 18 another toward Beth Horon, and the third toward the border land overlooking the Valley of Zeboim facing the wilderness. 19 Not a blacksmith could be found in the whole land of Israel, because the Philistines had said, “Otherwise the Hebrews will make swords or spears!” 20 So all Israel went down to the Philistines to have their plowshares, mattocks, axes and sickles sharpened. 21 The price was two-thirds of a shekel for sharpening plowshares and mattocks, and a third of a shekel for sharpening forks and axes and for repointing goads. 22 So on the day of the battle not a soldier with Saul and Jonathan had a sword or spear in his hand; only Saul and his son Jonathan had them.",
    "ESV": "16 And Saul and Jonathan his son and the people who were present with them stayed in Geba of Benjamin, but the Philistines encamped in Michmash. 17 And raiders came out of the camp of the Philistines in three companies. One company turned toward Ophrah, to the land of Shual; 18 another company turned toward Beth-horon; and another company turned toward the border that looks down on the Valley of Zeboim toward the wilderness. 19 Now there was no blacksmith to be found throughout all the land of Israel, for the Philistines said, “Lest the Hebrews make themselves swords or spears.” 20 But every one of the Israelites went down to the Philistines to sharpen his plowshare, his mattock, his axe, or his sickle, 21 and the charge was a pim for the plowshares and for the mattocks, and a third of a shekel for sharpening the axes and for setting the goads. 22 So on the day of the battle there was neither sword nor spear found in the hand of any of the people with Saul and Jonathan, but Saul and Jonathan his son had them.",
    "AMP": "16 Saul and Jonathan his son and the people with them were staying in Geba of Benjamin, while the Philistines encamped at Michmash. 17 And the raiding parties came out of the Philistine camp in three companies: one company turned toward Ophrah, to the land of Shual; 18 another company turned toward Beth-horon; and another company turned toward the border land overlooking the Valley of Zeboim toward the wilderness. 19 Now no blacksmith could be found in all the land of Israel, for the Philistines said, “Otherwise the Hebrews will make swords or spears.” 20 So all the Israelites went down to the Philistines, each to get his plowshare, his mattock, his axe, or his sickle sharpened. 21 And the charge was a pim (two-thirds of a shekel) for the plowshares and for the mattocks, and a third of a shekel for sharpening the axes and for setting the goads. 22 So it came to pass on the day of battle that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan; but Saul and Jonathan his son had them.",
    "NLT": "16 Saul and Jonathan and the men with them were staying at Geba in the land of Benjamin. The Philistines, meanwhile, were camped at Michmash. 17 Three raiding parties soon left the Philistine camp. One went north toward Ophrah in the land of Shual, 18 another went west to Beth-horon, and the third headed separation over the border toward the valley of Zeboim and the wilderness. 19 There were no blacksmiths in the land of Israel in those days. The Philistines wouldn’t allow them for fear they would make swords and spears for the Hebrews. 20 So whenever the Israelites needed to sharpen their plowshares, picks, axes, or sickles, they had to take them to a Philistine blacksmith. 21 The charges were as follows: a quarter of an ounce of silver for sharpening a plowshare or a pick, and an eighth of an ounce for sharpening an axe, a hoe, or an ox goad. 22 So on the day of the battle none of the people of Israel had a sword or spear, except for Saul and Jonathan."
  },
  "Psalms 62:11": {
    "KJV": "11 God hath spoken once; twice have I heard this; that power belongeth unto God.",
    "NKJV": "11 God has spoken once, Twice I have heard this: That power belongs to God.",
    "NIV": "11 One thing God has spoken, two things I have heard: Power belongs to you, God,",
    "ESV": "11 Once God has spoken; twice have I heard this: that power belongs to God,",
    "AMP": "11 God has spoken once, twice I have heard this: that power belongs to God.",
    "NLT": "11 God has spoken plainly, and I have heard it many times: Power, O God, belongs to you."
  },
  "Matthew 10:1": {
    "KJV": "1 And when he had called unto him his twelve disciples, he gave them power against unclean spirits, to cast them out, and to heal all manner of sickness and all manner of disease.",
    "NKJV": "1 And when He had called His twelve disciples to Him, He gave them power over unclean spirits, to cast them out, and to heal all kinds of sickness and all kinds of disease.",
    "NIV": "1 Jesus called his twelve disciples to him and gave them authority to drive out impure spirits and to heal every disease and sickness.",
    "ESV": "1 And he called to him his twelve disciples and gave them authority over unclean spirits, to cast them out, and to heal every disease and every affliction.",
    "AMP": "1 Jesus summoned His twelve disciples and gave them authority and power over unclean spirits, to cast them out, and to heal every kind of disease and every kind of sickness.",
    "NLT": "1 Jesus called his twelve disciples together and gave them authority to cast out evil spirits and to heal every kind of disease and illness."
  },
  "Mark 16:17-18": {
    "KJV": "17 And these signs shall follow them that believe; In my name shall they cast out devils; they shall speak with new tongues; 18 They shall take up serpents; and if they drink any deadly thing, it shall not hurt them; they shall lay hands on the sick, and they shall recover.",
    "NKJV": "17 And these signs will follow those who believe: In My name they will cast out demons; they will speak with new tongues; 18 they will take up serpents; and if they drink anything deadly, it will by no means hurt them; they will lay hands on the sick, and they will recover.”",
    "NIV": "17 And these signs will accompany those who believe: In my name they will drive out demons; they will speak in new tongues; 18 they will pick up snakes with their hands; and when they drink deadly poison, it will not hurt them at all; they will place their hands on sick people, and they will get well.”",
    "ESV": "17 And these signs will accompany those who believe: in my name they will cast out demons; they will speak in new tongues; 18 they will pick up serpents with their hands; and if they drink any deadly poison, it will not hurt them; they will lay their hands on the sick, and they will recover.”",
    "AMP": "17 And these signs will accompany those who believe: in My name they will cast out demons, they will speak in new tongues; 18 they will pick up serpents, and if they drink anything deadly, it will not hurt them; they will lay hands on the sick, and they will recover.”",
    "NLT": "17 These miraculous signs will accompany those who believe: They will cast out demons in my name, and they will speak in new languages. 18 They will be able to handle snakes with safety, and if they drink anything poisonous, it won’t hurt them. They will be able to place their hands on the sick, and they will be healed.”"
  },
  "1 Samuel 13:16": {
    "KJV": "16 And Saul, and Jonathan his son, and the people that were present with them, abode in Gibeah of Benjamin: but the Philistines encamped in Michmash.",
    "NKJV": "16 Saul, Jonathan his son, and the people present with them remained in Gibeah of Benjamin. But the Philistines encamped in Michmash.",
    "NIV": "16 Saul and his son Jonathan and the men with them were staying in Gibeah in Benjamin, while the Philistines camped at Michmash.",
    "ESV": "16 And Saul and Jonathan his son and the people who were present with them stayed in Geba of Benjamin, but the Philistines encamped in Michmash.",
    "AMP": "16 Saul and Jonathan his son and the people with them were staying in Geba of Benjamin, while the Philistines encamped at Michmash.",
    "NLT": "16 Saul and Jonathan and the men with them were staying at Geba in the land of Benjamin. The Philistines, meanwhile, were camped at Michmash."
  },
  "1 Samuel 13:17-18": {
    "KJV": "17 And the spoilers came out of the camp of the Philistines in three companies: one company turned unto the way that leadeth to Ophrah, unto the land of Shual: 18 And another company turned the way to Bethhoron: and another company turned to the way of the border that looketh to the valley of Zeboim toward the wilderness.",
    "NKJV": "17 Then raiders came out of the camp of the Philistines in three companies. One company turned onto the road to Ophrah, to the land of Shual, 18 another company turned toward the road to Beth Horon, and another company turned to the road of the border that overlooks the Valley of Zeboim toward the wilderness.",
    "NIV": "17 Raiding parties went out from the Philistine camp in three detachments. One turned toward Ophrah in the vicinity of Shual, 18 another toward Beth Horon, and the third toward the border land overlooking the Valley of Zeboim facing the wilderness.",
    "ESV": "17 And raiders came out of the camp of the Philistines in three companies. One company turned toward Ophrah, to the land of Shual; 18 another company turned toward Beth-horon; and another company turned toward the border that looks down on the Valley of Zeboim toward the wilderness.",
    "AMP": "17 And the raiding parties came out of the Philistine camp in three companies: one company turned toward Ophrah, to the land of Shual; 18 another company turned toward Beth-horon; and another company turned toward the border land overlooking the Valley of Zeboim toward the wilderness.",
    "NLT": "17 Three raiding parties soon left the Philistine camp. One went north toward Ophrah in the land of Shual, 18 another went west to Beth-honon, and the third headed toward the border overlooking the Valley of Zeboim and the wilderness."
  },
  "2 Corinthians 2:11": {
    "KJV": "11 Lest Satan should get an advantage of us: for we are not ignorant of his devices.",
    "NKJV": "11 lest Satan should take advantage of us; for we are not ignorant of his devices.",
    "NIV": "11 in order that Satan might not outwit us. For we are not unaware of his schemes.",
    "ESV": "11 so that we would not be outwitted by Satan; for we are not ignorant of his designs.",
    "AMP": "11 to keep Satan from taking advantage of us; for we are not ignorant of his schemes.",
    "NLT": "11 so that Satan will not outsmart us. For we are familiar with his evil schemes."
  },
  "1 Samuel 13:19-22": {
    "KJV": "19 Now there was no smith found throughout all the land of Israel: for the Philistines said, Lest the Hebrews make them swords or spears: 20 But all the Israelites went down to the Philistines, to sharpen every man his share, and his coulter, and his ax, and his mattock. 21 Yet they had a file for the mattocks, and for the coulters, and for the forks, and for the axes, and to sharpen the goads. 22 So it came to pass in the day of battle, that there was neither sword nor spear found in the hand of any of the people that were with Saul and Jonathan: but with Saul and with Jonathan his son was there found.",
    "NKJV": "19 Now there was no blacksmith to be found throughout all the land of Israel, for the Philistines said, “Lest the Hebrews make swords or spears.” 20 But all the Israelites would go down to the Philistines to sharpen each man’s plowshare, his mattock, his ax, and his sickle; 21 and the charge was a pim for the plowshares, the mattocks, the three-pronged forks, and the axes, and to sharpen the goads. 22 So it came to pass, on the day of battle, that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan. But they were found with Saul and Jonathan his son.",
    "NIV": "19 Not a blacksmith could be found in the whole land of Israel, because the Philistines had said, “Otherwise the Hebrews will make swords or spears!” 20 So all Israel went down to the Philistines to have their plowshares, mattocks, axes and sickles sharpened. 21 The price was two-thirds of a shekel for sharpening plowshares and mattocks, and a third of a shekel for sharpening forks and axes and for repointing goads. 22 So on the day of the battle not a soldier with Saul and Jonathan had a sword or spear in his hand; only Saul and his son Jonathan had them.",
    "ESV": "19 Now there was no blacksmith to be found throughout all the land of Israel, for the Philistines said, “Lest the Hebrews make themselves swords or spears.” 20 But every one of the Israelites went down to the Philistines to sharpen his plowshare, his mattock, his axe, or his sickle, 21 and the charge was a pim for the plowshares and for the mattocks, and a third of a shekel for sharpening the axes and for setting the goads. 22 So on the day of the battle there was neither sword nor spear found in the hand of any of the people with Saul and Jonathan, but Saul and Jonathan his son had them.",
    "AMP": "19 Now no blacksmith could be found in all the land of Israel, for the Philistines said, “Otherwise the Hebrews will make swords or spears.” 20 So all the Israelites went down to the Philistines, each to get his plowshare, his mattock, his axe, or his sickle sharpened. 21 And the charge was a pim (two-thirds of a shekel) for the plowshares and for the mattocks, and a third of a shekel for sharpening the axes and for setting the goads. 22 So it came to pass on the day of battle that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan; but Saul and Jonathan his son had them.",
    "NLT": "19 There were no blacksmiths in the land of Israel in those days. The Philistines wouldn’t allow them for fear they would make swords and spears for the Hebrews. 20 So whenever the Israelites needed to sharpen their plowshares, picks, axes, or sickles, they had to take them to a Philistine blacksmith. 21 The charges were as follows: a quarter of an ounce of silver for sharpening a plowshare or a pick, and an eighth of an ounce for sharpening an axe, a hoe, or an ox goad. 22 So on the day of the battle none of the people of Israel had a sword or spear, except for Saul and Jonathan."
  },
  "2 Corinthians 10:4": {
    "KJV": "4 (For the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds;)",
    "NKJV": "4 For the weapons of our warfare are not carnal but mighty in God for pulling down strongholds,",
    "NIV": "4 The weapons we fight with are not the weapons of the world. On the contrary, they have divine power to demolish strongholds.",
    "ESV": "4 For the weapons of our warfare are not of the flesh but have divine power to destroy strongholds.",
    "AMP": "4 The weapons of our warfare are not physical [weapons of flesh and blood], but they are mighty before God for the overthrow and destruction of strongholds,",
    "NLT": "4 We use God’s mighty weapons, not worldly weapons, to knock down the devil’s strongholds."
  },
  "1 Samuel 13:22": {
    "KJV": "22 So it came to pass in the day of battle, that there was neither sword nor spear found in the hand of any of the people that were with Saul and Jonathan: but with Saul and with Jonathan his son was there found.",
    "NKJV": "22 So it came to pass, on the day of battle, that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan. But they were found with Saul and Jonathan his son.",
    "NIV": "22 So on the day of the battle not a soldier with Saul and Jonathan had a sword or spear in his hand; only Saul and his son Jonathan had them.",
    "ESV": "22 So on the day of the battle there was neither sword nor spear found in the hand of any of the people with Saul and Jonathan, but Saul and Jonathan his son had them.",
    "AMP": "22 So it came to pass on the day of battle that there was neither sword nor spear found in the hand of any of the people who were with Saul and Jonathan; but Saul and Jonathan his son had them.",
    "NLT": "22 So on the day of the battle none of the people of Israel had a sword or spear, except for Saul and Jonathan."
  },
  "Acts 1:8": {
    "KJV": "8 But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.",
    "NKJV": "8 But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me in Jerusalem, and in all Judea and Samaria, and to the end of the earth.",
    "NIV": "8 But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.",
    "ESV": "8 But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.",
    "AMP": "8 But you will receive power and ability when the Holy Spirit comes upon you; and you will be My witnesses [to tell people about Me] both in Jerusalem and in all Judea, and Samaria, and even to the ends of the earth.",
    "NLT": "8 But you will receive power when the Holy Spirit comes upon you. And you will be my witnesses, telling people about me everywhere—in Jerusalem, throughout Judea, in Samaria, and to the ends of the earth.",
},

"Psalm 62:11": {
    "KJV": "God hath spoken once; twice have I heard this; that power belongeth unto God.",
    "NKJV": "God has spoken once, Twice I have heard this: That power belongs to God.",
    "NIV": "One thing God has spoken, two things I have heard: Power belongs to you, God,",
    "ESV": "Once God has spoken; twice have I heard this: that power belongs to God,",
    "AMP": "God has spoken once, twice I have heard this: that power belongs to God.",
    "NLT": "God has spoken plainly, and I have heard it many times: Power, O God, belongs to you."
},

  

};





const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { 
        title: string; 
        content: string; 
        scripture?: string
     };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
    lessonDate: string;
    lessonTitle: string;
    memoryVerse: string;
    memoryVerseRef: string;
    introduction: string;
    introScriptures: string[];
    lessonIntroScriptures: string[];
    aims: string;
    objectives: string;
    objectiveScriptures?: string[]; // Added optionally to prevent breaking existing data
    lessonIntro: string;
    lessonPoints: LessonPoint[];
    conclusion: string;
    conclusionScriptures: string[];
    prayerPoints: string[];
};

const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "July 12, 2026", 
    lessonTitle: "THE BELIEVERS NEGLIGENCE",

    memoryVerse:
        "be sober, be vigilant; because your adversary the devil, as a roaring lion, walketh about, seeking whom he may devour. - 1 Peter 5:8",
    memoryVerseRef: "1 Peter 5:8", 

    introScriptures: ["Psalms 62:11", "Matthew 10:1", "Mark 16:17-18", "Acts 1:8"],

    introduction:
        "It is true that our God is Almighty and has given us His surpassing power to dominate but so many Christians are too weak in comparison. Ps 62:11, Matt 10:1, Mark 16:17-18, Acts 1:8. The reason why believers seem powerless is because of negligence of what it takes to activate the resident power to maximum advantage and demonstrate supremacy. If one is careful to appreciate God's directives and watch for the enemy he will overcome always.",

    aims:
        "To reveal the deficiencies of a Christian in order to reposition him.",

    objectives:
        "To release the believer to dominate the earth and all that is in it.",

    objectiveScriptures: [],

    lessonIntro:
        "The battle line was drawn between Israel and the Philistines but Israel had no weapons to fight. The Philistines captured one of Israel's treasure cities and camped there while King Saul and his few quaking men were in the comfort of their luxurious headquarters city of Gibeah. The rest of the Israelites had hidden themselves for fear of the Philistines. The same experience awaits every negligent believer because we are in constant battle with the kingdom of darkness.",
        
    lessonIntroScriptures: ["1 Samuel 13:16-22"],
    
    lessonPoints: [
        {
            title: "LIVING IN COMFORTABLE ABODE",
            content:
                "King Saul and his few men stayed back in the comfort of Gibeah at the time of war. This is applicable to many believers in order to avoid confrontation. Notwithstanding, the Philistines drafted themselves out of comfort to a camp at Michmash in readiness to raid Israel. In this mode the believers always suffer loss because the battle is fought at his home. Verse 16.",
            scriptures: ["1 Samuel 13:16"],
            subPoints: [],
        },
        {
            title: "IGNORANT OF WAR STRATEGIES",
            content:
                "The Philistines had three raiding bands which also checkmated Israel but Saul and Israel had no strategy rather than staying in their comfort city. Verse 17-18. Many believers have lost battles in like manner because of lack of strategies. Don't be ignorant of the enemy's devices. 2 Cor 2:11.",
            scriptures: ["1 Samuel 13:17-18", "2 Corinthians 2:11"],
            subPoints: [],
        },
        {
            title: "TOO NEGLIGENT TO NOTICE NECESSITIES",
            content:
                "The Philistines disallowed Blacksmiths in Israel and sapped their economic strength in order to cripple their military strength. In all these, Saul read no meaning to it because he was too negligent. Verse 19 - 22. The believer has many weapons of war but if he is careless, the enemies will sap him of all to defeat him. 2 Cor 10:4.",
            scriptures: ["1 Samuel 13:19-22", "2 Corinthians 10:4"],
            subPoints: [],
        },
        {
            title: "NO PREPARATION",
            content:
                "Every army acquires and reserves weapons because those are her strength. The insufficient weapon on Israel's side shows that She wasn't prepared for war due to negligence. Verse 22.",
            scriptures: ["1 Samuel 13:22"],
            subPoints: [],
        },
    ],

    conclusion:
        "Negligence turns victors into victims. When a believer rests in spiritual comfort while the enemy plans strategies, defeat becomes inevitable. We must stay alert, guard our tools, and actively prepare for warfare.",

    conclusionScriptures: [],

    prayerPoints: [
        "Father, deliver me from every form of spiritual laziness and negligence that exposes my life to the attacks of the enemy.",
        "Lord, grant me divine strategies and keep me alert to understand the schemes and devices of the adversary.",
        "Oh Lord, stir up a passion for spiritual preparation within me; let none of the weapons You have given me be stripped away by the enemy."
    ],
});



    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    

   

   

   

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";


        if (appLoading) {
    const animatedText = "Complelling Favour - Genesis 39:1-6, Neh. 2:2-8".split("");

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Life Gate Ministries Worldwide
                </h1>
                <p className="text-xl text-white/90 mb-8">
                    Sunday School Lessons
                </p>

                {/* Single-color glowing neon text */}
                <div className="flex justify-center mb-6 text-3xl md:text-4xl font-extrabold">
                    {animatedText.map((char, idx) => (
                        <span
                            key={idx}
                            className="inline-block text-blue-400 drop-shadow-[0_0_10px_#00ffff] animate-[wave_1.5s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>

                <div className="text-white/80 mb-6 text-lg animate-pulse">
                    Loading Sunday School Lesson...
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p className="text-white/70 mt-3 text-sm">
                    {loadingProgress}%
                </p>
            </div>

            {/* Keyframes for smooth wave bounce */}
            <style>
                {`
                    @keyframes wave {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(8px); }
                        75% { transform: translateY(-6px); }
                    }
                `}
            </style>
        </div>
    );
}




    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            THE BELIEVERS NEGLIGENCE
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        













                    {activeTab === "intro" && (
                        <div className="space-y-6">
                            {editingContent === "intro" && (
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Edit2
                                            size={16}
                                            className="text-yellow-700"
                                        />
                                        <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                            Edit Mode Active
                                        </span>
                                    </span>
                                    <button
                                        onClick={() =>
                                            setEditingContent(null)
                                        }
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Done Editing
                                    </button>
                                </div>
                            )}
                            <div
                                className={`${
                                    darkMode
                                        ? "bg-blue-900/30"
                                        : "bg-blue-50"
                                } p-6 rounded-lg border-l-4 border-blue-600`}
                            >
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <BookOpen className="text-blue-600" />{" "}
                                    Memory Verse
                                </h3>
                                {editingContent === "intro" ? (
                                    <textarea
                                        value={contentData.memoryVerse}
                                        onChange={(e) =>
                                            updateContent(
                                                "memoryVerse",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={2}
                                    />
                                ) : (
                                    <blockquote className="text-xl italic mb-4">
                                        "{contentData.memoryVerse}"
                                    </blockquote>
                                )}
                                <button
                                    onClick={() =>
                                        showBibleVersions(
                                            contentData.memoryVerseRef
                                        )
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                >
                                    <BookOpen size={16} />
                                    Read {contentData.memoryVerseRef}
                                </button>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Text: 1 Samuel 13:16-22
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                "1 Samuel 13:16-22"
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read 1 Samuel 13:16-22
                                    </button>

                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Introduction
                                </h3>
                                {editingContent === "intro" ? (
                                    <textarea
                                        value={contentData.introduction}
                                        onChange={(e) =>
                                            updateContent(
                                                "introduction",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={6}
                                    />
                                ) : (
                                    <div>
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Psalm 62:11"
                                                    )
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm shadow-md"
                                            >
                                                <BookOpen size={16} />
                                                Psalm 62:11
                                            </button>
                                            <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Matthew 10:1"
                                                    )
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm shadow-md"
                                            >
                                                <BookOpen size={16} />
                                                Matthew 10:1
                                            </button>
                                            <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Mark 16:17-18"
                                                    )
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm shadow-md"
                                            >
                                                <BookOpen size={16} />
                                                Mark 16:17-18
                                            </button>
                                            <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Acts 1:8"
                                                    )
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm shadow-md"
                                            >
                                                <BookOpen size={16} />
                                                Acts 1:8
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div
                                className={`${
                                    darkMode
                                        ? "bg-green-900/30"
                                        : "bg-green-50"
                                } p-6 rounded-lg`}
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    Aims and Objectives
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <strong className="text-green-700 dark:text-green-400 block mb-1">
                                            AIMS:
                                        </strong>
                                        {editingContent === "intro" ? (
                                            <textarea
                                                value={contentData.aims}
                                                onChange={(e) =>
                                                    updateContent(
                                                        "aims",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="leading-relaxed opacity-90">{contentData.aims}</p>
                                        )}
                                    </div>
                                    <div>
                                        <strong className="text-green-700 dark:text-green-400 block mb-1">
                                            OBJECTIVES:
                                        </strong>
                                        {editingContent === "intro" ? (
                                            <textarea
                                                value={contentData.objectives}
                                                onChange={(e) =>
                                                    updateContent(
                                                        "objectives",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={2}
                                            />
                                        ) : (
                                            <div>
                                                <p className="leading-relaxed opacity-90 mb-3">
                                                    {contentData.objectives}
                                                </p>
                                                {contentData.objectiveScriptures && contentData.objectiveScriptures.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {contentData.objectiveScriptures.map((scripture) => (
                                                            <button
                                                                key={scripture}
                                                                onClick={() => showBibleVersions(scripture)}
                                                                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-xs font-medium shadow-md"
                                                            >
                                                                <BookOpen size={14} />
                                                                Read {scripture}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


























                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {/* {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )} */}
                                            {/* 2. The Scripture Buttons container safely placed outside the <p> tag */}
                                            {/* {contentData.lessonIntroScriptures && contentData.lessonIntroScriptures.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {contentData.lessonIntroScriptures.map((scripture) => (
                                                        <button
                                                            key={scripture}
                                                            onClick={() => showBibleVersions(scripture)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-sm"
                                                        >
                                                            <BookOpen size={16} />
                                                            Read {scripture}
                                                        </button>
                                                    ))}
                                                </div>
                                            )} */}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
            

                       











                       
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
