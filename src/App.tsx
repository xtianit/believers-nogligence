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
  "2 Timothy 3:5": {
    "KJV": "5 Having a form of godliness, but denying the power thereof: from such turn away.",
    "NKJV": "5 having a form of godliness but denying its power. And from such people turn away!",
    "NIV": "5 having a form of godliness but denying its power. Have nothing to do with such people.",
    "ESV": "5 having the appearance of godliness, but denying its power. Avoid such people.",
    "AMP": "5 holding to a form of [outward] godliness (religion), although they have denied its power [for their conduct nullifies their claim of faith]. Avoid such people and keep far away from them.",
    "NLT": "5 They will act religious, but they will reject the power that could make them godly. Stay away from people like that!"
  },
  "Ephesians 4:17-18": {
    "KJV": "17 This I say therefore, and testify in the Lord, that ye henceforth walk not as other Gentiles walk, in the vanity of their mind, 18 Having the understanding darkened, being alienated from the life of God through the ignorance that is in them, because of the blindness of their heart:",
    "NKJV": "17 This I say, therefore, and testify in the Lord, that you should no longer walk as the rest of the Gentiles walk, in the futility of their mind, 18 having their understanding darkened, being alienated from the life of God because of the ignorance that is in them, because of the blindness of their heart;",
    "NIV": "17 So I tell you this, and insist on it in the Lord, that you must no longer live as the Gentiles do, in the futility of their thinking. 18 They are darkened in their understanding and separated from the life of God because of the ignorance that is in them due to the hardening of their hearts.",
    "ESV": "17 Now this I say and testify in the Lord, that you must no longer walk as the Gentiles do, in the futility of their minds. 18 They are darkened in their understanding, alienated from the life of God because of the ignorance that is in them, due to their hardness of heart.",
    "AMP": "17 So I say this, and affirm in the Lord, that you must no longer walk as the Gentiles walk, in the futility of their minds [and in the foolishness and emptiness of their souls], 18 for their [moral] understanding is darkened and their reasoning is beclouded; [they are] alienated and estranged from the life of God [with no share in it] because of the [willful] ignorance that is deep-seated in them, because of the hardness and insensitivity of their hearts.",
    "NLT": "17 With the Lord’s authority I say this: Live no longer as the Gentiles do, for they are hopelessly confused. 18 Their minds are full of darkness; they wander far from the life God gives because they have closed their minds and hardened their hearts against him."
  },
  "Romans 12:1": {
    "KJV": "1 I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
    "NKJV": "1 I beseech you therefore, brethren, by the mercies of God, that you present your bodies a living sacrifice, holy, acceptable to God, which is your reasonable service.",
    "NIV": "1 Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
    "ESV": "1 I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship.",
    "AMP": "1 Therefore I urge you, brothers and sisters, by the mercies of God, to present your bodies [dedicating all of yourselves, set apart] as a living sacrifice, holy and well-pleasing to God, which is your rational (logical, intelligent) act of worship.",
    "NLT": "1 And so, dear brothers and sisters, I plead with you to give your bodies to God because of all he has done for you. Let them be a living and holy sacrifice—the kind he will find acceptable. This is truly the way to worship him."
  },
  "Matthew 23:13": {
    "KJV": "13 But woe unto you, scribes and Pharisees, hypocrites! for ye shut up the kingdom of heaven against men: for ye neither go in yourselves, neither suffer ye them that are entering to go in.",
    "NKJV": "13 “But woe to you, scribes and Pharisees, hypocrites! For you shut up the kingdom of heaven against men; for you neither go in yourselves, nor do you allow those who are entering to go in.",
    "NIV": "13 “Woe to you, teachers of the law and Pharisees, hypocrites! You shut the door of the kingdom of heaven in people’s faces. You yourselves do not enter, nor will you let those enter who are trying to.",
    "ESV": "13 “But woe to you, scribes and Pharisees, hypocrites! For you shut the kingdom of heaven in people's faces. For you neither enter yourselves nor allow those who would enter to go in.",
    "AMP": "13 “But woe to you, [self-righteous] scribes and Pharisees, hypocrites, because you shut the kingdom of heaven in front of people; for you do not enter yourselves, nor do you allow those who are entering to go in.",
    "NLT": "13 “What sorrow awaits you teachers of religious law and you Pharisees. Hypocrites! For you shut the door of the Kingdom of Heaven in people’s faces. You won’t go in yourselves, and you don’t let others enter either."
  },
  "John 17:15": {
    "KJV": "15 I pray not that thou shouldest take them out of the world, but that thou shouldest keep them from the evil.",
    "NKJV": "15 I do not pray that You should take them out of the world, but that You should keep them from the evil one.",
    "NIV": "15 My prayer is not that you take them out of the world but that you protect them from the evil one.",
    "ESV": "15 I do not ask that you take them out of the world, but that you keep them from the evil one.",
    "AMP": "15 I do not ask You to take them out of the world, but to keep them and protect them from the evil one.",
    "NLT": "15 I’m not asking you to take them out of the world, but to keep them safe from the evil one."
  },
  "Proverbs 4:23": {
    "KJV": "23 Keep thy heart with all diligence; for out of it are the issues of life.",
    "NKJV": "23 Keep your heart with all diligence, For out of it spring the issues of life.",
    "NIV": "23 Above all else, guard your heart, for everything you do flows from it.",
    "ESV": "23 Keep your heart with all vigilance, for from it flow the springs of life.",
    "AMP": "23 Watch over your heart with all diligence, For from it flow the springs of life.",
    "NLT": "23 Guard your heart above all else, for it determines the course of your life."
  },
  "Hosea 4:6": {
    "KJV": "6 My people are destroyed for lack of knowledge: because thou hast rejected knowledge, I will also reject thee, that thou shalt be no priest to me: seeing thou hast forgotten the law of thy God, I will also forget thy children.",
    "NKJV": "6 My people are destroyed for lack of knowledge. Because you have rejected knowledge, I also will reject you from being priest to Me; Because you have forgotten the law of your God, I also will forget your children.",
    "NIV": "6 my people are destroyed from lack of knowledge. “Because you have rejected knowledge, I also reject you as my priests; because you have ignored the law of your God, I also will ignore your children.",
    "ESV": "6 My people are destroyed for lack of knowledge; because you have rejected knowledge, I reject you from being a priest to me. And since you have forgotten the law of your God, I also will forget your children.",
    "AMP": "6 My people are destroyed for lack of knowledge. Because you [the priestly nation] have rejected knowledge, I will also reject you from being My priest. Since you have forgotten the law of your God, I will also forget your children.",
    "NLT": "6 My people are being destroyed because they don’t know me. Since you priests refuse to know me, I refuse to recognize you as my priests. Since you have forgotten the laws of your God, I will forget to bless your children."
  },
  "Romans 6:1": {
    "KJV": "1 What shall we say then? Shall we continue in sin, that grace may abound?",
    "NKJV": "1 What shall we say then? Shall we continue in sin that grace may abound?",
    "NIV": "1 What shall we say, then? Shall we go on sinning so that grace may increase?",
    "ESV": "1 What shall we say then? Are we to continue in sin that grace may abound?",
    "AMP": "1 What shall we say then? Are we to continue in sin so that [God’s gift of] grace may increase and overflow?",
    "NLT": "1 Well then, should we keep on sinning so that God can show us more and more of his wonderful grace?"
  },
  "Matthew 5:16": {
    "KJV": "16 Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
    "NKJV": "16 Let your light so shine before men, that they may see your good works and glorify your Father in heaven.",
    "NIV": "16 In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    "ESV": "16 In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.",
    "AMP": "16 Let your light shine before men in such a way that they may see your good deeds and moral excellence, and [recognize and honor and] glorify your Father who is in heaven.",
    "NLT": "16 In the same way, let your good deeds shine out for all to see, so that everyone will praise your heavenly Father."
  }
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
    lessonDate: "July 5, 2026", 
    lessonTitle: "LIVING AS A CHILD OF GOD",

    memoryVerse:
        "Having a form of godliness, but denying the power thereof: from such, turn away. - 2 Tim. 3:5",
    memoryVerseRef: "2 Timothy 3:5", 

    introScriptures: ["Ephesians 4:17-18"],

    introduction:
        "Most of us children of God have come on board the kingdom of God from a gentile background whose attributes were opposed to God's way of life. Since we have become Christians we ought to live the life which is contrary to gentile life of ungodliness - Rom 12:1.",

    aims:
        "To discourage the Christian brethren from living a life which is contrary to their profession.",

    // objectives:
        // "That you may be the light that attracts instead of darkness that will repel people from coming to Jesus - Matt 23:13.",
    // Add this inside your useState object alongside your objective text
    objectives:
        "That you may be the light that attracts instead of darkness that will repel people from coming to Jesus - Matt 23:13.",
    objectiveScriptures: ["Matthew 23:13"],
    
    lessonIntro:
        "Jesus prayed the Father not to take his children away from the world but that he may keep them. As long as you remain in the world, your former lifestyle may appeal to you but know that it is against God and you cannot therefore live as an unbeliever. If the thing that makes an unbeliever remains as one does exist in you, it will make you live as one. Let us consider the scriptures in the text.",
        
    lessonIntroScriptures: ["John 17:15", "Ephesians 4:17-18"],
    
    lessonPoints: [
        {
            title: "1. THE BLINDNESS OF THE HEART",
            content:
                "The heart is the key that determines the life of a man and if it is blind, then the man is bound to stumble and fall. Heart blindness causes hardness of the heart because it doesn't know what decision it is making and mostly it does the wrong ones. Certain things are responsible for blindness of the heart.",
            scriptures: ["Proverbs 4:23"],
            subPoints: [
                { title: "(A)", content: "Refusal to surrender to Jesus Christ" },
                { title: "(B)", content: "Feeling of self-sufficiency" },
                { title: "(C)", content: "Pride" },
                { title: "(D)", content: "Arrogance" }
            ],
        },
        {
            title: "2. IGNORANCE",
            content:
                "The Bible says that people are destroyed for lack of knowledge. Ignorance is a deadly weapon of Satan to destroy its victims. Heart blindness leads to ignorance. Ignorance is the factor responsible for Satan taking advantage of man to darken his understanding, and separation from the life of God. Ignorance produces:",
            scriptures: ["Hosea 4:6"],
            subPoints: [],
        },
        {
            title: "A. VANITY OF THE MIND",
            content:
                "It means fruitlessness - mind malfunction. The mind becomes strange to what is good and beneficial.",
            scriptures: [],
            subPoints: [],
        },
        {
            title: "B. UNDERSTANDING DARKENED",
            content:
                "Gentiles have so yielded to Satan and the systems of the world which originated from Satan. Satan is darkness and would steal your understanding by blocking it lest you be free from his control, knowing the truth will free a man, so Satan would do anything to stop this. If you don't appreciate the things of God then call for help because Satan has enveloped your understanding with darkness.",
            scriptures: [],
            subPoints: [],
        },
    ],

    conclusion:
        "By your fruits, you can tell whether you are still living as a gentile (unbeliever). You cannot continue to sin that grace may abound - Rom 6:1. Live as a child of God. You profess that men may glorify God - Matt 5:16.",

    conclusionScriptures: ["Romans 6:1", "Matthew 5:16"],

    prayerPoints: [
        "Lord, I throw off every residual trace of the old lifestyle and fully surrender my heart to be illuminated by Your Holy Spirit!",
        "Father, destroy every root of pride, arrogance, and self-sufficiency in me; let my life be a shining light that draws others closer to Jesus!",
        "Oh Lord, break every stronghold of ignorance or spiritual blindness over my mind, and give me a clear understanding to walk daily as Your true child!"
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
    const animatedText = "My Month of Complelling Favour Genesis 39:1-7, Neh. 2:1-8".split("");

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
                            Living As A Child of God
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
                                    Text: Eph. 4:17-18
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                "Ephesians 4:17-18"
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read Ephesians 4:17-18
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
                                                        "Romans 12:1"
                                                    )
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm shadow-md"
                                            >
                                                <BookOpen size={16} />
                                                Romans 12:1
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
                                            {contentData.lessonIntroScriptures && contentData.lessonIntroScriptures.length > 0 && (
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
                                            )}
                                    
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
