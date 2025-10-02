import React from "react";
import { GraduationCap, HelpCircle, BookOpen, PlayCircle, MessageCircle, MessageSquare } from "lucide-react";

export default function HelpCenter() {
  const cards = [
    { icon: <GraduationCap size={24} />, title: "How to Start Trading?", desc: "You can also participate in free tournaments and earn real money for winning." },
    { icon: <HelpCircle size={24} />, title: "FAQ", desc: "Here you will find quick answers to common questions!" },
    { icon: <BookOpen size={24} />, title: "Knowledge Base", desc: "Here you will find quick answers to common questions!" },
    { icon: <PlayCircle size={24} />, title: "Video tutorials", desc: "You can also participate in free tournaments and earn real money for winning." },
    { icon: <MessageSquare size={24} />, title: "My Questions", desc: "Customize your account according to your preferences." },
    { icon: <MessageCircle size={24} />, title: "Live Chat", desc: "Customize your account according to your preferences." },
  ];

  return (
    <div className="help-center">
      <h2 className="title_help">How can we help you?</h2>
      <div className="search_box_help">
        <input type="text" placeholder="Search" />
      </div>

      <div className="cards_help">
        {cards.map((c, i) => (
          <div key={i} className="card_help">
            <div className="icon_help">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
