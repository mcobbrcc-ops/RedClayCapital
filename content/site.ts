import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileCheck2,
  FileWarning,
  Flame,
  Home,
  KeyRound,
  Landmark,
  ShieldCheck,
  Signature,
  UserRoundX,
  Wrench
} from "lucide-react";

export const site = {
  name: "Red Clay Capital, LLC",
  url: "https://redclaycap.com",
  phone: "(919) 778-1228",
  phoneHref: "tel:+19197781228",
  smsHref: "sms:+19197781228",
  email: "MCobb@RedClayCap.com",
  contactLabel: "Acquisitions Desk",
  ogImage: "/social-preview.png"
};

export const situations = [
  {
    title: "Inherited & Estate Properties",
    icon: Home,
    copy: "We help families evaluate inherited homes, estate properties, deferred maintenance, cleanouts, and sale timelines without forcing a public listing."
  },
  {
    title: "Difficult Tenants",
    icon: UserRoundX,
    copy: "Share the lease, occupancy situation, and known repairs so we can discuss whether a sale could fit your plans."
  },
  {
    title: "Subject-To & Existing Finance",
    icon: Landmark,
    copy: "Existing loans affect a sale. Start with your payoff questions and ask for a clear explanation of any proposed financing arrangement."
  },
  {
    title: "Seller Finance Options",
    icon: Signature,
    copy: "A proposal with payments over time needs careful review of the buyer, payment terms, security, and risk before you decide."
  },
  {
    title: "Unauthorized Occupants",
    icon: ShieldCheck,
    copy: "Squatters, unauthorized occupants, abandoned rentals, and access problems require a careful acquisition review instead of a one-size-fits-all offer."
  },
  {
    title: "Foreclosure Concerns",
    icon: AlertTriangle,
    copy: "When deadlines matter, we help owners compare a private sale with other available paths and move only when the numbers and timeline are realistic."
  },
  {
    title: "Major Repairs & Code Issues",
    icon: Wrench,
    copy: "Foundation problems, roof failure, outdated systems, code violations, liens, and cleanouts can be reviewed as part of the acquisition model."
  },
  {
    title: "Vacant Properties",
    icon: Building2,
    copy: "Vacant and neglected homes can create taxes, insurance risk, vandalism, utilities, and maintenance exposure. We evaluate them without requiring repairs."
  },
  {
    title: "Title or Ownership Issues",
    icon: FileWarning,
    copy: "Tell us about known ownership, estate, or lien questions. A qualified closing professional will need to confirm what a sale requires."
  },
  {
    title: "Fire, Water, or Storm Damage",
    icon: Flame,
    copy: "Fire damage, smoke damage, storm impact, water intrusion, and insurance-related complications can still be evaluated for an as-is acquisition."
  }
];

export const process = [
  {
    title: "Submit the property",
    copy: "Share the address, condition, occupancy, financing, and timeline. A concise summary is enough for an initial review."
  },
  {
    title: "Review the acquisition options",
    copy: "We evaluate market data, repairs, title, tenants, existing debt, and closing constraints before presenting a practical path."
  },
  {
    title: "Close with professional coordination",
    copy: "If the proposal works, closing is coordinated through professional closing partners with clear milestones and flexible timing."
  }
];

export const trustPoints = [
  "A conversation before a commitment",
  "As-is acquisitions",
  "Property-specific evaluation",
  "Discuss closing requirements",
  "Clear written terms",
  "Private off-market sale"
];

export const faqs = [
  {
    question: "Do I need to make repairs before selling?",
    answer: "You do not need to repair or clean up a property to request a review. Any requirements for an eventual sale should be clear in the written agreement."
  },
  {
    question: "Can you buy a house with tenants?",
    answer: "You can request a review of a tenant-occupied property. Share the lease and access situation; a potential sale still needs to account for tenant rights, written agreements, and applicable requirements."
  },
  {
    question: "Can you help with inherited property?",
    answer: "Yes. We can help families understand sale options for inherited homes and coordinate with appropriate closing professionals."
  },
  {
    question: "How fast can you close?",
    answer: "There is no fixed closing time for every property. Access, title, financing, contract conditions, and the closing professional's schedule all matter. Tell us your preferred date so we can discuss what may be realistic."
  },
  {
    question: "Can I close remotely?",
    answer: "In many cases, yes. Remote and mail-away closing options may be available through the closing attorney or title partner."
  },
  {
    question: "Am I obligated to accept the offer?",
    answer: "No. Requesting a review simply helps you understand one possible path forward."
  },
  {
    question: "Do you buy houses in bad condition?",
    answer: "You can request a review of a damaged or repair-heavy home without improving it first. Condition and repair uncertainty affect whether an offer is possible and its terms."
  },
  {
    question: "How is an investor offer different from listing?",
    answer: "Listing can expose a home to a wider buyer pool and may produce a higher price. A direct offer may reduce preparation and showings, but the buyer accounts for repairs, holding costs, resale costs, and risk. Compare expected proceeds and contract conditions, as well as price."
  },
  {
    question: "Will there be fees or closing costs?",
    answer: "Ask for a written breakdown of the proposed price, costs, credits, and what each party pays. We do not quote universal no-fee terms on this website; the written agreement and closing statement control."
  },
  {
    question: "Who will be buying my property?",
    answer: "Before signing, ask who the named buyer is, whether an investor partner or contract assignment is involved, who is responsible for closing, and which conditions allow cancellation. Any proposed structure should be explained in writing."
  },
  {
    question: "What happens after I submit the form?",
    answer: "Your inquiry goes to Red Clay Capital for review and follow-up using the contact information and preference you provide. We may ask about access, condition, ownership, and timing. Submitting details is a request for a conversation, not an instant valuation or a purchase agreement."
  },
  {
    question: "Can I email instead of giving a phone number?",
    answer: "Yes. The offer request accepts a usable email address or phone number. Choose how you prefer to be contacted, and provide the contact detail that matches it."
  }
];

export const resources = [
  {
    type: "Guide",
    title: "Should I Sell My House As-Is?",
    href: "/blog/sell-house-as-is-major-repairs",
    copy: "A practical breakdown of repair costs, timelines, buyer expectations, and when an as-is sale may make sense."
  },
  {
    type: "Article",
    title: "Can I Sell a House With Problem Tenants?",
    href: "/blog/sell-rental-property-with-bad-tenants",
    copy: "Learn what options owners may have when a rental property has become stressful, occupied, or difficult to manage."
  },
  {
    type: "Guide",
    title: "What Does an Investor Offer Really Mean?",
    href: "/blog/understanding-an-investor-offer",
    copy: "Compare the price, expected proceeds, repairs, and conditions behind an offer before choosing your next step."
  }
];

export type BlogPost = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  category: string;
  readTime: string;
  keywords: string[];
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  related?: string[];
  sources?: Array<{ label: string; href: string }>;
};

export const blogPosts: BlogPost[] = [
{
  "slug": "understanding-an-investor-offer",
  "title": "How to Compare an Investor Offer With Listing Your Home",
  "eyebrow": "Know what the number means",
  "description": "Compare the price, expected proceeds, repairs, contract conditions, and timing behind a property offer before deciding how to sell.",
  "category": "Comparing offers",
  "readTime": "4 min read",
  "keywords": [],
  "sections": [
    {
      "heading": "Start with the result you need",
      "body": [
        "Before comparing numbers, write down the outcome that matters to you. You might want the most money after expenses, fewer repairs to manage, a workable moving date, or a way to sell an occupied property. These priorities can point to different choices.",
        "An investor offer is one option to evaluate. A listing can bring competition from a wider pool of buyers. Neither path automatically produces the best result for every property, and a request for an offer is not a commitment."
      ]
    },
    {
      "heading": "Understand what a buyer is pricing",
      "body": [
        "A buyer considering renovation and resale may look at comparable properties, the current condition, estimated repair work, time to complete the project, carrying expenses, future selling costs, and a margin for uncertainty. Access restrictions or unknown damage can increase that uncertainty.",
        "These estimates are assumptions, not a guaranteed formula for your home. Ask which comparable properties were considered, what repair scope is assumed, and whether the proposed price can change after an inspection. A buyer’s business model does not establish your property’s market value."
      ]
    },
    {
      "heading": "Compare expected proceeds, not just headline prices",
      "body": [
        "Make two simple worksheets: one for the direct offer and one for a listing estimate. Start with an estimated sale price, then identify the costs each route would leave with you. These might include agreed selling costs, repairs or credits, moving arrangements, and the expense of holding the property until closing.",
        "Keep uncertainty visible. A listing estimate is not an accepted offer. A repair estimate may change. The written proposal determines who pays which costs in a direct sale. Ask a closing professional for payoff and settlement information rather than assuming the gross price is what you will receive."
      ]
    },
    {
      "heading": "Read the conditions that can change the result",
      "body": [
        "Check the named buyer, deposit terms, inspection or due-diligence period, financing conditions, title requirements, and cancellation provisions. Ask when the price is final, who may request an extension, and what happens if the agreed date is missed.",
        "If an investor partner or assignment is involved, ask who ultimately purchases the home and which party remains responsible under the agreement. Do not infer that a website inquiry means a guaranteed cash purchase. Give yourself room to have an independent adviser review the proposed contract."
      ]
    },
    {
      "heading": "Prepare a useful first conversation",
      "body": [
        "Bring the property address, known repairs, occupancy, and your desired timing. If you already have a written offer or listing estimate, use it to identify questions about terms and costs. You do not need to send financial account details or identity documents to request an initial review.",
        "Red Clay Capital can discuss a potential sale in North Carolina, Georgia, or Ohio. Tell us what you want to compare, and keep asking questions until the proposed next step is clear."
      ]
    }
  ],
  "related": [
    "sell-house-as-is-major-repairs",
    "sell-inherited-house-with-multiple-heirs"
  ]
},
  {
    slug: "sell-house-as-is-major-repairs",
    title: "Selling a House As-Is When Repairs Are Bigger Than the Budget",
    eyebrow: "Major repair properties",
    category: "Repairs",
    readTime: "3 min read",
    description:
      "A practical guide for owners dealing with roof failure, foundation issues, outdated systems, cleanouts, and repair costs that no longer make sense.",
    keywords: ["sell house as-is", "major repairs", "cash buyer for damaged house"],
    sections: [
      {
        heading: "When the repair list starts controlling the sale",
        body: [
          "A traditional listing assumes the property can be cleaned, photographed, shown, inspected, negotiated, and financed. That process becomes harder when the house needs a roof, HVAC, electrical work, plumbing repairs, foundation attention, or a full cleanout before it can compete with updated homes.",
          "Many owners start with good intentions. They call contractors, collect estimates, price materials, and try to decide which repairs are worth doing. The problem is that each repair can expose another issue. A roof estimate turns into sheathing repairs. A flooring project exposes subfloor damage. A buyer inspection turns an already tight deal into a second negotiation."
        ]
      },
      {
        heading: "What an as-is acquisition changes",
        body: [
          "An as-is sale shifts the property from a retail buyer conversation to an acquisition conversation. Instead of asking what repairs a homeowner should complete before listing, the question becomes whether a buyer can price the property with the repairs, holding costs, and risk already included.",
          "This does not mean every as-is offer will be the highest possible number. It means the seller can compare the terms of a direct proposal against the time, money, uncertainty, and stress of preparing the house for the open market."
        ]
      },
      {
        heading: "What Red Clay Capital reviews",
        body: [
          "Red Clay Capital reviews condition, access, neighborhood demand, repair scope, title status, occupancy, utilities, timeline, and closing constraints. We are not asking homeowners to make the property perfect before we look at it.",
          "For some sellers, the best option is still a traditional listing. For others, the cleaner decision is to accept a private as-is sale, avoid repair management, and close on a defined timeline."
        ]
      },
{
  "heading": "A comparison you can put on paper",
  "body": [
    "Create a list of work you would need to organize before listing, with estimated costs and time. Add the costs of keeping the home during that period. Compare that with a written as-is proposal, including any deductions, inspection conditions, and expenses you would still pay.",
    "Ask whether the price is subject to further inspection and how changes would be handled. Selling as-is does not mean a seller can skip requirements that apply to the transaction. A qualified local professional can explain the documents and disclosures for your property."
  ]
}
    ],
    related: ["sell-fire-damaged-house-north-carolina", "sell-house-with-code-violations"]
  },
  {
    slug: "sell-rental-property-with-bad-tenants",
    title: "Selling a Rental Property With Difficult Tenants",
    eyebrow: "Tenant occupied property",
    category: "Tenants",
    readTime: "3 min read",
    description:
      "How landlords can think through non-payment, access problems, lease issues, property damage, and selling a rental without waiting for perfect conditions.",
    keywords: ["sell house with tenants", "bad tenants", "tenant occupied rental property"],
    sections: [
      {
        heading: "The rental may be worth more as a problem solved than a problem managed",
        body: [
          "A tenant-occupied property can be a strong asset when rent is current, access is smooth, and the home is being maintained. It can become a drain when rent stops, communication breaks down, access is limited, or the property condition is deteriorating.",
          "Owners often wait because they believe the tenant issue must be solved before the property can be sold. In some cases that is true. In others, an investor buyer may be able to evaluate the property with the occupancy issue included."
        ]
      },
      {
        heading: "Why traditional buyers hesitate",
        body: [
          "A buyer planning to live in a rental may need access, a workable possession date, financing approval, and inspection contingencies. Difficult tenants can disrupt all four. Missed appointments, limited access, unknown interior condition, and lease uncertainty can reduce the buyer pool quickly.",
          "A professional acquisition review looks at rent status, lease terms, legal posture, property condition, local market demand, and the cost of resolving the issue after closing."
        ]
      },
      {
        heading: "A private sale can create a cleaner exit",
        body: [
          "Red Clay Capital can review tenant-occupied rentals, difficult occupant situations, inherited rentals, and properties where the owner no longer wants to manage the risk. The goal is not to minimize the problem. The goal is to price it honestly and determine whether an as-is sale creates a better outcome than continued management.",
          "Landlords should keep records organized: lease documents, payment history, notices, repair records, and communication history. Those details help clarify the situation and reduce uncertainty during review."
        ]
      },
{
  "heading": "Prepare the handoff before choosing a route",
  "body": [
    "Put the lease, amendments, deposit information, rent ledger, pending maintenance requests, and property management agreement in one folder. Note what you know and what still needs confirmation. Avoid sending tenant identity documents or financial account details in an initial website inquiry.",
    "Compare an occupied sale with waiting for an appropriate turnover. Include vacancy risk, ongoing expenses, repair needs, and your available time. Have a qualified local adviser explain tenant rights, access, notices, and any obligations that continue through a sale."
  ]
}
    ],
    related: ["sell-vacant-or-abandoned-house", "subject-to-seller-finance-house-sale"]
  },
  {
    slug: "subject-to-seller-finance-house-sale",
    title: "Subject-To and Seller Finance: What Homeowners Should Understand",
    eyebrow: "Creative finance",
    category: "Finance",
    readTime: "3 min read",
    description:
      "A careful, plain-English overview of subject-to purchases, seller finance structures, and why the terms matter as much as the purchase price.",
    keywords: ["subject to real estate", "seller finance house sale", "creative finance buyer"],
    sections: [
      {
        heading: "Cash is not the only possible acquisition structure",
        body: [
          "Many sellers only think in terms of a cash purchase price. That can be the right structure, especially when the seller needs a clean payoff and a fast closing. But some properties have financing, equity, rates, payoff timing, or tax considerations that make terms worth discussing.",
          "Subject-to and seller finance are not magic phrases. They are transaction structures that need clear documentation, careful review, and a seller who understands the tradeoffs."
        ]
      },
      {
        heading: "What subject-to generally means",
        body: [
          "In a subject-to transaction, a buyer may acquire the property subject to existing financing remaining in place. The seller's existing loan is not automatically paid off at closing the way it would be in a typical cash sale.",
          "That can create flexibility in some situations, but it also requires serious attention to risk, loan terms, insurance, payment controls, due-on-sale language, servicing, and documentation. Sellers should ask questions and should not sign terms they do not understand."
        ]
      },
      {
        heading: "What seller finance generally means",
        body: [
          "Seller finance means the seller may receive payments over time under agreed terms instead of receiving the full purchase price at closing. The structure may include a down payment, interest rate, monthly payment, maturity date, default remedies, and security documents.",
          "The right structure depends on the seller's need for cash, risk tolerance, tax planning, existing liens, and the buyer's ability to perform. Red Clay Capital can review whether a terms-based proposal is practical, but sellers should evaluate it with appropriate legal and tax professionals."
        ]
      },
{
  "heading": "Questions to take to independent advisers",
  "body": [
    "Ask the lender and your own attorney whether a proposed transfer is permitted, what consent is needed, and what obligations could remain with you. A deed transfer and a release from loan liability are different issues; do not rely on a buyer’s verbal assurance that the loan will be handled.",
    "For a payment-based proposal, ask what happens after a missed payment, how payments and insurance will be verified, what security exists, and what the practical cost of enforcing the agreement could be. Compare this with a conventional sale and obtain tax advice before assuming a particular result."
  ]
}
    ],
    sources: [{"label": "CFPB: mortgage assumption disclosures", "href": "https://www.consumerfinance.gov/rules-policy/regulations/1026/18/"}],
    related: ["foreclosure-timeline-cash-sale-options", "sell-house-as-is-major-repairs"]
  },
  {
    slug: "sell-fire-damaged-house-north-carolina",
    title: "Selling a Fire-Damaged House in North Carolina",
    eyebrow: "Fire damage",
    category: "Damage",
    readTime: "3 min read",
    description:
      "What to consider when smoke, fire, water intrusion, insurance questions, or repair scope make a normal sale difficult.",
    keywords: ["sell fire damaged house", "fire damage North Carolina", "cash buyer fire damaged property"],
    sections: [
      {
        heading: "Fire damage is rarely just one problem",
        body: [
          "After a fire, the visible damage is only part of the issue. Smoke, water used during suppression, electrical safety, roof exposure, structural questions, odor, permitting, and insurance paperwork can all affect the path forward.",
          "Some owners plan to repair and later realize the project is larger than expected. Others live out of area, inherited the property, or simply do not want to manage contractors, insurance timelines, and a resale process."
        ]
      },
      {
        heading: "Why as-is buyers evaluate differently",
        body: [
          "Some buyers will not consider a fire-damaged home. Financing may be difficult, inspections can be uncertain, and the repair path may be too complex for a normal buyer.",
          "An acquisition buyer reviews the property based on current condition, repair scope, title, insurance status, local demand, and the cost of carrying the property through renovation or redevelopment."
        ]
      },
      {
        heading: "What to gather before requesting a review",
        body: [
          "Helpful information includes the property address, photos if available, whether utilities are active, insurance claim status, access details, known structural concerns, and any city or county notices.",
          "Red Clay Capital can review fire, smoke, water, and storm-damaged properties without asking the owner to make repairs before the conversation starts."
        ]
      },
{
  "heading": "Keep the sale decision separate from claim assumptions",
  "body": [
    "Ask the insurer how a transfer could affect an open claim, and ask the appropriate local authority or qualified contractor about access and repair restrictions. Do not assume a buyer’s offer includes an insurance payment or takes over every obligation.",
    "When comparing repair with sale, separate written estimates from unknowns. Keep the documented damage scope, proposed repair costs, carrying costs, and the buyer’s contract conditions visible in the same comparison. No purchase price or repair schedule is promised by requesting a review."
  ]
}
    ],
    related: ["sell-house-as-is-major-repairs", "sell-house-with-code-violations"]
  },
  {
    slug: "foreclosure-timeline-cash-sale-options",
    title: "Foreclosure Pressure: Comparing a Cash Sale With Other Options",
    eyebrow: "Timeline pressure",
    category: "Foreclosure",
    readTime: "3 min read",
    description:
      "How homeowners can think about deadlines, payoff numbers, reinstatement, listing timelines, and private sale options when time is limited.",
    keywords: ["foreclosure help", "sell house before foreclosure", "cash sale foreclosure"],
    sections: [
      {
        heading: "Deadlines change the decision",
        body: [
          "When foreclosure pressure is involved, the best option is often the one that can be completed in time. A traditional listing may produce a strong price, but it also depends on preparation, showings, buyer financing, inspections, appraisal, title, and closing coordination.",
          "A private cash sale may be worth comparing because it can reduce moving parts. That does not mean it is always the best choice. Homeowners should compare reinstatement, repayment, refinance, loan modification, listing, and sale options as early as possible."
        ]
      },
      {
        heading: "Information matters",
        body: [
          "Before anyone can evaluate a realistic sale timeline, the owner needs accurate payoff or reinstatement information, deadline dates, lien details, title status, and property access. Guessing at these details can create false confidence.",
          "Professional closing partners help confirm what must be paid at closing and whether the transaction can be completed before a deadline."
        ]
      },
      {
        heading: "A clear offer is only useful if it can close",
        body: [
          "Before relying on any offer, ask the buyer and closing professional to explain the remaining conditions and whether the transaction can be completed within the relevant time. An attractive number is not enough if required steps cannot be completed.",
          "If a cash sale is a fit, the process should move quickly into title review, closing coordination, and written terms so the owner understands what happens next."
        ]
      },
{
  "heading": "Get independent help while comparing a sale",
  "body": [
    "The Consumer Financial Protection Bureau directs homeowners who are struggling with mortgage payments to their servicer and HUD-approved housing counselors. A counselor can help you understand available options; you do not need to wait for an investor conversation.",
    "Foreclosure procedures differ by state and by the type of proceeding. In North Carolina, the Judicial Branch explains the court process and available resources. Use the actual notice and qualified local advice to confirm your next deadline. An offer request, negotiation, or unsigned proposal does not stop a foreclosure."
  ]
}
    ],
    sources: [{"label": "CFPB: mortgage help and housing counselors", "href": "https://www.consumerfinance.gov/mortgagehelp/"}, {"label": "North Carolina Judicial Branch: foreclosures", "href": "https://www.nccourts.gov/help-topics/housing/foreclosures"}],
    related: ["subject-to-seller-finance-house-sale", "sell-house-as-is-major-repairs"]
  },
  {
    slug: "sell-house-with-code-violations",
    title: "Selling a House With Code Violations, Liens, or City Notices",
    eyebrow: "Code and title issues",
    category: "Distress",
    readTime: "3 min read",
    description:
      "A homeowner's guide to code violations, municipal notices, liens, unsafe conditions, and selling when the paperwork feels complicated.",
    keywords: ["sell house with code violations", "property liens", "city notices"],
    sections: [
      {
        heading: "Code issues can make a normal sale harder",
        body: [
          "Code violations, unsafe structure notices, unpaid utilities, nuisance complaints, and municipal liens can make a property feel stuck. Owners may not know whether they need to repair the issue, pay the balance, dispute the notice, or sell before costs increase.",
          "Traditional buyers often hesitate because they do not know what they are inheriting. Lenders may also object if the condition creates habitability or safety concerns."
        ]
      },
      {
        heading: "What a buyer needs to review",
        body: [
          "The review usually starts with the address, notice documents, lien information, photos, access, occupancy, and any communication from the city or county. Title and closing partners may need to confirm what must be paid or resolved at closing.",
          "Some issues can be handled through closing. Others must be addressed before a sale can proceed. The important thing is to identify the facts early."
        ]
      },
      {
        heading: "A professional process reduces uncertainty",
        body: [
          "Red Clay Capital evaluates code and title complications as part of the acquisition process. That includes repair exposure, municipal requirements, title requirements, and the seller's preferred timeline.",
          "The goal is a clear written path, not vague promises. If the issue affects price or closing timing, it should be discussed plainly before the seller makes a decision."
        ]
      },
{
  "heading": "Build a notice checklist",
  "body": [
    "For each notice, record the issuing office, date, deadline, stated issue, and a contact for questions. Keep payment receipts, inspection reports, and written responses together. If a balance is disputed, distinguish the disputed amount from a confirmed payoff.",
    "Ask the proposed closing professional what must be cleared before transfer and what the written agreement expects of you. Do not assume a buyer’s willingness to review the property cancels a municipal obligation or changes the deadline on a notice."
  ]
}
    ],
    related: ["sell-fire-damaged-house-north-carolina", "sell-vacant-or-abandoned-house"]
  },
  {
    slug: "sell-inherited-house-with-multiple-heirs",
    title: "Selling an Inherited House When Multiple Heirs Are Involved",
    eyebrow: "Inherited property",
    category: "Probate",
    readTime: "3 min read",
    description:
      "How families can approach inherited property decisions when repairs, emotions, probate, distance, and multiple decision-makers are involved.",
    keywords: ["sell inherited house", "multiple heirs", "probate property sale"],
    sections: [
      {
        heading: "Inherited property decisions are rarely just financial",
        body: [
          "An inherited house can come with memories, responsibilities, repair issues, tax questions, insurance concerns, and family disagreement. The property may be vacant, occupied by a relative, behind on maintenance, or located far from the people responsible for handling it.",
          "When multiple heirs are involved, the sale process needs clarity. Who has authority? Is probate required? Are there liens? Does everyone agree on the timeline? Are personal belongings still inside?"
        ]
      },
      {
        heading: "Why a private as-is sale may help",
        body: [
          "A private as-is sale can reduce the number of decisions a family has to make before selling. Instead of coordinating repairs, cleanouts, showings, listing preparation, and open-market negotiations, the family can compare a direct sale option against the likely retail path.",
          "That comparison should be practical. Families should consider net proceeds, time, carrying costs, emotional bandwidth, and the risk of the sale falling apart after inspection."
        ]
      },
      {
        heading: "How Red Clay Capital approaches inherited homes",
        body: [
          "Red Clay Capital reviews inherited properties with discretion and patience. We can evaluate repair-heavy houses, occupied inherited homes, vacant properties, and homes where the family needs time to coordinate documents or belongings.",
          "Closing still depends on proper authority and title clearance. When the structure is workable, the goal is a clean closing timeline and a professional process that respects the family situation."
        ]
      },
{
  "heading": "Confirm authority before treating an offer as a family decision",
  "body": [
    "In North Carolina, the Judicial Branch explains that estate administration is generally handled through the clerk of superior court and that real property is not always administered through the probate estate. In Georgia and Ohio, use the relevant court resources below to locate the appropriate process; do not apply one state’s procedure to another property.",
    "A useful first checklist is the deed, any will or estate appointment papers, the names of possible decision-makers, known debt, and the property’s condition. Ask a qualified local attorney or closing professional who has authority to sign and what must happen before a transfer. Agreement among relatives alone may not answer those questions."
  ]
}
    ],
    sources: [{"label": "North Carolina Judicial Branch: estates", "href": "https://www.nccourts.gov/help-topics/wills-and-estates/estates"}, {"label": "Georgia Courts: court directory", "href": "https://georgiacourts.gov/georgia-courts-directory/"}, {"label": "Supreme Court of Ohio: estate forms", "href": "https://www.supremecourt.ohio.gov/forms/all-forms/decedents-estate/8"}],
    related: ["sell-house-as-is-major-repairs", "sell-vacant-or-abandoned-house"]
  },
  {
    slug: "sell-vacant-or-abandoned-house",
    title: "Selling a Vacant or Abandoned House Before It Becomes a Bigger Problem",
    eyebrow: "Vacant homes",
    category: "Vacancy",
    readTime: "3 min read",
    description:
      "Why vacant homes can create insurance, vandalism, utility, tax, and maintenance risk, and how owners can compare private sale options.",
    keywords: ["sell vacant house", "abandoned property", "cash buyer vacant home"],
    sections: [
      {
        heading: "Vacancy has a cost",
        body: [
          "A vacant property can feel quiet, but it is rarely cost-free. Taxes, insurance, utilities, lawn care, break-ins, vandalism, weather exposure, and code complaints can turn a delayed decision into a more expensive problem.",
          "Out-of-area owners often feel the pressure most. They may not be close enough to check on the property, meet contractors, manage repairs, or respond quickly if something goes wrong."
        ]
      },
      {
        heading: "Why timing matters",
        body: [
          "Vacant homes can deteriorate quickly. A small roof leak becomes interior damage. A broken window becomes unauthorized access. Deferred lawn care becomes a city notice. The longer the property sits, the more uncertainty a buyer has to price into the offer.",
          "That is why some owners choose to compare a private as-is sale before the property condition gets worse."
        ]
      },
      {
        heading: "A clean exit can be worth more than waiting",
        body: [
          "Red Clay Capital evaluates vacant and abandoned properties based on condition, location, access, title, and timeline. Sellers do not need to clean out the house or complete repairs before requesting a review.",
          "A direct sale may not be right for every owner, but it can create a clear exit when the property has become a liability instead of an asset."
        ]
      },
{
  "heading": "Compare the next three months with a proposed sale",
  "body": [
    "Write down the actual recurring costs: tax and insurance payments, utilities, grounds care, management, and known maintenance. Add the work needed to monitor access and respond to problems. Keep estimates separate from bills you have already received.",
    "Ask your insurer whether the current occupancy status affects coverage and ask the relevant local office about any notices or registration requirements. If you live elsewhere, tell a prospective buyer how access can be arranged safely. Do not post lockbox codes in an initial inquiry."
  ]
}
    ],
    related: ["sell-house-with-code-violations", "sell-rental-property-with-bad-tenants"]
  }
];

export const servicePages = [
  {
    "slug": "areas-we-serve",
    "title": "Sell a Property in North Carolina, Georgia or Ohio",
    "eyebrow": "Our focus markets",
    "description": "Explore Red Clay Capital property reviews in North Carolina, Georgia, and Ohio, with practical state resources and a clear way to request an offer.",
    "sections": [
      "Our focus is helping owners in North Carolina, Georgia, and Ohio explore a potential sale. Start with your property address and what you want to change: repairs, an inherited home, a rental you no longer want to manage, vacancy, or a move.",
      "Coverage is evaluated property by property. A state or city page is a place to begin the conversation; it does not guarantee that every address qualifies for an offer. We do not claim an office in each market.",
      "Use the state guides below to organize the right questions before reaching out. An initial request does not require repairs, a cleanout, or a commitment to sell."
    ],
    "keywords": []
  },
  {
    "slug": "sell-your-house-fast",
    "title": "Want to Sell Your House? Start With a Clear Plan.",
    "eyebrow": "Timing without pressure",
    "description": "Compare a potential as-is sale with listing, understand what affects timing, and request an offer from Red Clay Capital.",
    "sections": [
      "If you have a moving date, an unwanted property, or a growing repair list, the first useful step is to name the deadline and the reason behind it. A desired moving date and a legal notice are different constraints; both need to be discussed before any closing date is promised.",
      "A direct sale may involve less preparation and fewer showings. Listing can reach more buyers and may produce a higher sale price. Compare the likely money you keep, the work each option requires, and the conditions that could delay or cancel a transaction.",
      "We begin with your property details and a conversation. Condition, location, access, occupancy, ownership, and the proposed terms determine whether an offer is possible. Requesting a review does not reserve a price or a closing date.",
      "If there is a time-sensitive notice, continue speaking with the appropriate lender, attorney, or housing counselor. An inquiry through this website does not suspend a deadline."
    ],
    "keywords": []
  },
  {
    "slug": "how-it-works",
    "title": "A Clearer Path From Property Details to a Decision",
    "eyebrow": "How it works",
    "description": "Share your property, discuss your situation, compare a potential offer, and understand the written agreement before deciding.",
    "sections": [
      "1. Tell us the basics. Share the property address, your name, and a way to reach you. Condition, occupancy, and your preferred timing are useful if you know them, but you do not need a complete file to start.",
      "2. Have a conversation. We review what you shared and may ask about repairs, access, ownership, and what matters most to you. Let us know whether you prefer a call, text, or email. You do not need to repair or clean the property before this conversation.",
      "3. Evaluate the property and a possible offer. Nearby comparable sales, current condition, estimated repairs, holding and resale costs, access, occupancy, and title questions can affect the proposal. An offer is not guaranteed for every property.",
      "4. Compare the written terms. Look at price, expected proceeds, who pays each cost, due diligence, cancellation rights, the named buyer, and the proposed closing date. Ask whether a partner or assignment is involved and how it affects the agreement. You can seek independent advice before signing.",
      "5. Proceed only if the agreement fits. A sale then depends on the contract conditions and the closing professional confirming the necessary title, payoff, signing, and funding requirements. Requesting an offer is separate from accepting one or signing a purchase agreement."
    ],
    "keywords": []
  },
  {
    "slug": "about-red-clay-capital",
    "title": "About Red Clay Capital",
    "eyebrow": "Meet the business",
    "description": "Red Clay Capital LLC, owned by Michael Cobb, helps property owners explore potential sales in North Carolina, Georgia, and Ohio.",
    "sections": [
      "Red Clay Capital LLC is owned by Michael Cobb. This is our public website for homeowners considering a property sale in North Carolina, Georgia, or Ohio.",
      "A property decision is rarely just a price. You may be managing repairs from another state, sorting through an inheritance, dealing with a rental, or making room for a move. Our starting point is understanding the property and the result you want.",
      "We discuss a potential acquisition after reviewing the information you share. We want you to understand the proposed buyer, price, costs, conditions, and timing before deciding. If an investor partner, assignment, or financing arrangement is proposed, ask for that structure to be explained in writing.",
      "Our website does not provide an instant valuation or guarantee a purchase. It gives you a direct way to begin a conversation with Red Clay Capital and compare a potential offer with your other options.",
      "You can reach us by calling or texting (919) 778-1228, by emailing MCobb@RedClayCap.com, or through the offer request form."
    ],
    "keywords": []
  },
  {
    "slug": "faq",
    "title": "Questions Before You Request an Offer",
    "eyebrow": "Straight answers",
    "description": "Answers about as-is sales, fees, repairs, tenants, timing, buyer identity, privacy, and what happens after you contact Red Clay Capital.",
    "sections": [
      "You should be able to understand the next step before sharing your information. These answers explain the review process and the questions worth asking before accepting a proposal.",
      "Every property and written agreement is different. If a term affects your decision, ask for it to be addressed explicitly in the proposed contract."
    ],
    "keywords": []
  },
  {
    "slug": "contact",
    "title": "Let’s Talk About Your Property",
    "eyebrow": "Contact Red Clay Capital",
    "description": "Call or text (919) 778-1228, email Red Clay Capital, or request a property review in North Carolina, Georgia, or Ohio.",
    "sections": [
      "Call or text (919) 778-1228, or email MCobb@RedClayCap.com. If you prefer to start online, the offer request form asks for the property location, your name, and a usable phone number or email address.",
      "A short description is enough: where the property is, what you want help comparing, and when you would like to sell. You can mention repairs, occupancy, or ownership questions if they are relevant.",
      "Please avoid sending Social Security numbers, bank details, access codes, or unredacted identity documents in the initial inquiry. If additional documents are needed, ask how to share them appropriately.",
      "A text link opens your messaging app; you decide whether to send a message. We do not promise immediate replies or round-the-clock availability."
    ],
    "keywords": []
  },
  {
    "slug": "blog",
    "title": "Homeowner Resources",
    "eyebrow": "Understand your options",
    "description": "Practical guides to comparing as-is offers, repairs, inherited homes, rentals, vacancy, and selling decisions.",
    "sections": [
      "Use these guides to organize your questions and compare the work, costs, and uncertainty of different sale options. They are starting points for a property-specific conversation."
    ],
    "keywords": []
  },
  {
    "slug": "testimonials",
    "title": "Homeowner Feedback",
    "eyebrow": "Clear expectations",
    "description": "Learn what to expect when discussing a property with Red Clay Capital.",
    "sections": [
      "Trust starts with being able to ask direct questions. Before choosing a buyer, ask about the written terms, how the purchase will be funded, who is responsible for closing, and what happens if conditions change.",
      "Our process and contact pages explain how to start a conversation and what to review before making a commitment."
    ],
    "keywords": []
  },
  {
    "slug": "recently-purchased-properties",
    "title": "Property Situations We Can Discuss",
    "eyebrow": "Explore your options",
    "description": "Discuss inherited homes, repairs, vacancy, and rental property questions with Red Clay Capital.",
    "sections": [
      "A house that needs work, an inherited property, or a rental can each raise different questions. Start by explaining the condition, ownership, occupancy, and outcome you want.",
      "The resources on this website describe sale considerations. They are not presented as completed purchases or case studies. Contact us to discuss your own property."
    ],
    "keywords": []
  },
  {
    "slug": "our-buying-process",
    "title": "Our Buying Process",
    "eyebrow": "What to expect",
    "description": "Understand the steps in a Red Clay Capital property review and how to evaluate a potential offer.",
    "sections": [
      "Share the property details, have a conversation, and review a potential proposal. If a proposal fits, carefully compare its written costs, conditions, buyer identity, and closing requirements.",
      "The complete process guide explains each step, from your first inquiry to a decision about a purchase agreement."
    ],
    "keywords": []
  },
  {
    "slug": "why-homeowners-choose-us",
    "title": "What You Should Expect From a Property Buyer",
    "eyebrow": "Choose with confidence",
    "description": "Questions to ask a property buyer about price, costs, buyer identity, written terms, and closing requirements.",
    "sections": [
      "Look for a clear explanation of how the offer relates to the property condition and market. A larger headline price is not automatically a better result if deductions or conditions are unclear.",
      "Ask who the buyer is and whether a partner or contract assignment is part of the proposed transaction. Request written terms, a breakdown of costs, and an explanation of contingencies and cancellation rights.",
      "Keep room to compare your options. A direct sale can reduce some preparation, while listing can introduce more buyers. Your decision should reflect your timing, expected proceeds, and comfort with the agreement."
    ],
    "keywords": []
  },
  {
    "slug": "sell-house-with-subject-to-financing",
    "title": "Questions About Selling With Existing Financing",
    "eyebrow": "Review the full terms",
    "description": "Understand what to ask before considering a sale where existing financing could remain in place.",
    "sections": [
      "If a proposal involves leaving an existing loan in place, ask your lender and an independent real estate attorney to explain the consequences before signing. Do not assume a transfer of the property also releases your loan obligations.",
      "Ask about lender approval requirements, due-on-sale provisions, payment servicing, insurance, default remedies, and how the seller will know payments are current. A proposal should address these questions in writing.",
      "You can share your situation with Red Clay Capital, but this page is not a promise that a particular financing structure is available or appropriate. Compare any proposal with a sale that pays off existing debt."
    ],
    "keywords": []
  },
  {
    "slug": "seller-finance-house-sale",
    "title": "Considering Seller Financing? Know What to Ask.",
    "eyebrow": "Payments over time",
    "description": "Questions about payment terms, buyer qualification, security, and independent advice when considering seller financing.",
    "sections": [
      "A proposal with payments over time changes the decision from a sale price alone to a longer financial relationship. Consider how much money you need at closing and what would happen if later payments were missed.",
      "Ask a qualified attorney and tax professional to review the buyer, down payment, repayment schedule, interest, maturity date, security documents, and remedies. Do not rely on a verbal promise about protection or tax outcomes.",
      "If you contact Red Clay Capital, describe your priorities and existing financing. Any possible structure needs property-specific review and a written agreement."
    ],
    "keywords": []
  },
  {
    "slug": "sell-house-with-bad-tenants",
    "title": "Selling a Tenant-Occupied Property",
    "eyebrow": "A rental you are ready to leave behind",
    "description": "Discuss an occupied rental, organize lease information, and compare a sale with continuing to manage the property.",
    "sections": [
      "You do not need to describe an occupied rental as a perfect property to start a conversation. Share whether rent is current, what the lease says about access, and which repairs are known.",
      "Gather the lease and amendments, deposit records, a rent ledger, repair requests, and relevant notices. These help a prospective buyer understand the property without relying on assumptions.",
      "A sale needs to account for tenant rights and existing agreements. Do not promise vacant possession or arrange access contrary to the lease or applicable requirements; ask a qualified local professional when obligations are unclear.",
      "Compare selling occupied with waiting for an appropriate turnover. Include carrying costs, repairs, management effort, and the uncertainty of either path."
    ],
    "keywords": []
  },
  {
    "slug": "sell-fire-damaged-house",
    "title": "Selling a Fire-Damaged House As-Is",
    "eyebrow": "After property damage",
    "description": "Explore a potential as-is sale after fire, smoke, or water damage and organize the information a buyer may need.",
    "sections": [
      "After a fire, the sale decision may depend on safety restrictions, the known damage, insurance questions, and whether you want to manage repairs. You can request a review before completing renovation work.",
      "Useful details include the address, available photos taken safely, professional damage reports, current access restrictions, and the status of any insurance claim. Do not enter an unsafe structure just to gather information for a review.",
      "Compare the potential proceeds and obligations from selling with the money, time, and uncertainty involved in repair. Ask the insurer and relevant professionals how a proposed sale would affect an open claim or required work."
    ],
    "keywords": []
  },
  {
    "slug": "sell-house-with-code-violations",
    "title": "Selling With Code Notices or Title Questions",
    "eyebrow": "Get the facts together",
    "description": "Prepare code notices, lien information, and ownership questions for a potential property sale.",
    "sections": [
      "Start with the actual paperwork: the notice, the issuing authority, the stated deadline, and any balance or case number. A short description from memory may miss a condition that affects closing.",
      "Share what is known about repairs, occupancy, access, and prior attempts to resolve the issue. A qualified closing professional may need to confirm liens, payoff amounts, and the requirements for a transfer.",
      "An offer request does not resolve a code case or change a deadline. Continue communicating with the issuing authority and appropriate advisers while exploring a sale."
    ],
    "keywords": []
  },
  {
    "slug": "privacy",
    "title": "Privacy and Your Property Inquiry",
    "eyebrow": "Your information",
    "description": "How Red Clay Capital uses property inquiries, contact preferences, technical data, and attribution information.",
    "sections": [
      "Red Clay Capital LLC receives the name, contact details, property location, contact preference, and any optional information you submit. We use this information to review your inquiry, respond, and keep a record of the conversation.",
      "Website inquiries are stored and delivered through service providers into Red Clay Capital’s lead management system. We use your inquiry within Red Clay Capital and with service providers needed to operate the inquiry process. Do not include sensitive identity, financial, or access information in free-text fields.",
      "We may associate a submission with permitted campaign identifiers, referring site, landing page, and technical data used to operate and protect the website. These help us understand how an inquiry arrived and prevent abuse. Names, contact details, property addresses, and messages do not belong in general analytics events.",
      "We keep limited referral and campaign context in your browser tab while you browse. If optional analytics is available, you can allow or decline it; we remember that choice in your browser and honor Do Not Track. Declining optional analytics does not prevent an inquiry. We do not save a draft of your form details in browser storage.",
      "Requesting a reply is separate from permission for future marketing. Use the contact preference in the form to tell us how you would like us to respond. Tapping a call or text link opens your device’s app and does not by itself grant marketing permission.",
      "To ask about your information, request a correction or deletion, or change your contact preference, email MCobb@RedClayCap.com or call (919) 778-1228. Some records may need to be retained for transaction, security, or legal purposes; we will review your request in context.",
      "This notice describes this public website and its property inquiry process. External resources linked from our guides have their own privacy practices. Updated September 5, 2026."
    ],
    "keywords": []
  }
];

export const localSeoPages = [
  {
    slug: "sell-your-house-fast-burlington-nc",
    title: "Sell My House Fast in Burlington NC",
    eyebrow: "Burlington cash home buyers",
    description:
      "Red Clay Capital helps Burlington homeowners compare private cash offer options for inherited, distressed, repair-heavy, vacant, or unwanted properties.",
    sections: [
      "If you need to sell a house fast in Burlington, NC, an as-is cash offer can help you avoid repairs, showings, and a long listing timeline.",
      "We review the property, the local market, and the situation behind the sale so you can understand whether a cash offer is the right path."
    ],
    keywords: ["sell my house fast Burlington NC", "cash home buyers Burlington NC", "sell distressed property Alamance County"]
  },
  {
    slug: "sell-your-house-fast-graham-nc",
    title: "Sell My House Fast in Graham NC",
    eyebrow: "Graham property solutions",
    description:
      "Graham homeowners can request a private property review for an as-is sale before making repairs or preparing a listing.",
    sections: [
      "Selling a house fast in Graham may make sense when repairs, tenants, inheritance, or timing make a traditional sale difficult.",
      "Red Clay Capital keeps the process private and explains your options clearly before any decision is needed."
    ],
    keywords: ["sell house fast Graham NC", "cash home buyers central North Carolina", "sell house as-is Graham NC"]
  },
  {
    slug: "sell-your-house-fast-greensboro-nc",
    title: "Sell My House Fast in Greensboro NC",
    eyebrow: "Greensboro cash offers",
    description:
      "Red Clay Capital helps Greensboro homeowners explore potential offer options for inherited, distressed, tenant-occupied, or repair-heavy homes.",
    sections: [
      "If you are searching for companies that buy houses in Greensboro, our process is built around privacy, clear communication, and no pressure.",
      "We can review inherited property, homes needing major repairs, vacant houses, and rental properties that no longer fit your plans."
    ],
    keywords: ["we buy houses Greensboro NC", "sell inherited house Greensboro NC", "cash home buyers Greensboro NC"]
  },
  {
    slug: "sell-your-house-fast-haw-river-nc",
    title: "Sell My House Fast in Haw River NC",
    eyebrow: "Haw River as-is sales",
    description:
      "Haw River homeowners can compare a private as-is cash sale for houses with repairs, vacancy, inherited ownership, or stressful timelines.",
    sections: [
      "If you are deciding what to do with a Haw River property, separate the work needed to maintain it from work a particular buyer may request.",
      "Red Clay Capital reviews the full situation and discusses the next step if a potential offer is a practical fit."
    ],
    keywords: ["sell house as-is Haw River NC", "cash home buyers central North Carolina", "sell distressed property Alamance County"]
  },
  {
    slug: "sell-your-house-fast-roxboro-nc",
    title: "Sell My House Fast in Roxboro NC",
    eyebrow: "Roxboro cash home buyers",
    description:
      "Red Clay Capital helps Roxboro homeowners evaluate as-is cash offer options for unwanted, inherited, damaged, vacant, or tenant-occupied houses.",
    sections: [
      "Compare the proposed price, costs, conditions, and timing of a direct sale with the work involved in listing.",
      "Tell us your preferred timing; access, title, the proposed agreement, and closing requirements determine what is possible."
    ],
    keywords: ["cash home buyers Roxboro NC", "sell my house fast Roxboro NC", "sell house as-is Roxboro NC"]
  }
];

export const cityPages = [
  {
    slug: "raleigh-nc",
    city: "Raleigh",
    state: "NC",
    title: "Sell My House Fast in Raleigh NC",
    description:
      "Red Clay Capital helps Raleigh homeowners compare private cash offer options for inherited, damaged, vacant, tenant-occupied, or unwanted houses.",
    localNotes: [
      "Raleigh homeowners often reach out when repair costs, tenant issues, inherited property questions, or timing pressure make a traditional listing difficult.",
      "We review the property's condition, neighborhood context, timeline, and the situation behind the sale before discussing next steps."
    ]
  },
  {
    slug: "durham-nc",
    city: "Durham",
    state: "NC",
    title: "Sell My House Fast in Durham NC",
    description:
      "Explore a respectful as-is cash sale option for unwanted, inherited, occupied, or repair-heavy properties in Durham.",
    localNotes: [
      "Durham property owners may need a flexible solution when a house needs repairs, has occupancy complications, or no longer fits their plans.",
      "Red Clay Capital keeps the review private and focuses on clarity before asking for any decision."
    ]
  },
  {
    slug: "cary-nc",
    city: "Cary",
    state: "NC",
    title: "Sell My House Fast in Cary NC",
    description:
      "Cary homeowners can request a private property review and compare an as-is cash offer with a traditional listing.",
    localNotes: [
      "A cash offer may be useful when the owner wants privacy, a simpler closing, or a sale without repairs and public showings.",
      "We help homeowners understand whether an as-is sale is practical for their timeline and property situation."
    ]
  },
  {
    slug: "chapel-hill-nc",
    city: "Chapel Hill",
    state: "NC",
    title: "Sell My House Fast in Chapel Hill NC",
    description:
      "Red Clay Capital helps Chapel Hill homeowners evaluate as-is sale options for stressful or complicated property situations.",
    localNotes: [
      "Inherited homes, rental issues, vacancy, and repairs can make a normal sale feel harder than expected.",
      "Our process is built around a private review, clear communication, and no pressure to accept an offer."
    ]
  },
  {
    slug: "fayetteville-nc",
    city: "Fayetteville",
    state: "NC",
    title: "Sell My House Fast in Fayetteville NC",
    description:
      "Fayetteville homeowners can request a private cash offer review for unwanted houses, tenant issues, major repairs, or fast timeline needs.",
    localNotes: [
      "Some owners need a simpler way to sell without repairs, cleanouts, showings, or long listing timelines.",
      "We review the property as-is and explain the next step before any commitment is needed."
    ]
  },
  {
    slug: "wilmington-nc",
    city: "Wilmington",
    state: "NC",
    title: "Sell My House Fast in Wilmington NC",
    description:
      "Red Clay Capital helps Wilmington homeowners compare as-is cash sale options for damaged, inherited, vacant, or unwanted properties.",
    localNotes: [
      "Storm damage, repairs, vacancy, and distance from the property can make ownership stressful.",
      "A private property review can help you understand whether a fast, as-is sale is a realistic path forward."
    ]
  },
  {
    slug: "burlington-nc",
    city: "Burlington",
    state: "NC",
    title: "Sell My House Fast in Burlington NC",
    description:
      "Red Clay Capital helps Burlington homeowners compare private cash offer options for inherited, distressed, vacant, or repair-heavy houses.",
    localNotes: [
      "Burlington and Alamance County homeowners often reach out when repairs, inheritance, vacancy, or timing make a traditional sale difficult.",
      "We review the property as-is and help you understand whether a private cash offer is a practical fit."
    ],
    href: "/sell-your-house-fast-burlington-nc"
  },
  {
    slug: "graham-nc",
    city: "Graham",
    state: "NC",
    title: "Sell My House Fast in Graham NC",
    description:
      "Graham homeowners can request a private property review for an as-is sale before making repairs or preparing a listing.",
    localNotes: [
      "A fast sale may help when a property needs repairs, has ownership questions, or is simply no longer wanted.",
      "Red Clay Capital keeps the process calm, private, and clear from first conversation to closing."
    ],
    href: "/sell-your-house-fast-graham-nc"
  },
  {
    slug: "greensboro-nc",
    city: "Greensboro",
    state: "NC",
    title: "Sell My House Fast in Greensboro NC",
    description:
      "Red Clay Capital helps Greensboro homeowners explore potential offer options for inherited, distressed, tenant-occupied, or repair-heavy homes.",
    localNotes: [
      "Greensboro homeowners may need a simpler sale when repairs, tenants, inheritance, or timing make listing stressful.",
      "We evaluate the full situation and provide a clear, no-pressure option."
    ],
    href: "/sell-your-house-fast-greensboro-nc"
  },
  {
    slug: "haw-river-nc",
    city: "Haw River",
    state: "NC",
    title: "Sell My House Fast in Haw River NC",
    description:
      "Haw River homeowners can compare a private as-is cash sale for houses with repairs, vacancy, inherited ownership, or stressful timelines.",
    localNotes: [
      "Selling as-is can help homeowners avoid repairs, cleaning, and repeated showings.",
      "Our process is built to make the next step clear without pressure."
    ],
    href: "/sell-your-house-fast-haw-river-nc"
  },
  {
    slug: "roxboro-nc",
    city: "Roxboro",
    state: "NC",
    title: "Sell My House Fast in Roxboro NC",
    description:
      "Red Clay Capital helps Roxboro homeowners evaluate cash offer options for unwanted, inherited, damaged, vacant, or tenant-occupied houses.",
    localNotes: [
      "A private property review can help you understand whether a fast, as-is sale fits your situation.",
      "We focus on clear communication, privacy, and flexible closing options."
    ],
    href: "/sell-your-house-fast-roxboro-nc"
  }
];

export const seoPages = [
  "Sell My House Fast",
  "Inherited Property",
  "Problem Tenants",
  "Squatters",
  "Foreclosure Help",
  "Fire Damaged House",
  "Water Damaged House",
  "Title Problems",
  "Vacant Property",
  "Major Repairs"
];

export const schemaHighlights = [BadgeCheck, ClipboardCheck, KeyRound];
