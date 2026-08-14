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
  phone: "(888) 626-3213",
  email: "MCobb@RedClayCap.com",
  contactLabel: "Acquisitions Desk",
  ogImage: "/icon.svg"
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
    copy: "Rental properties with non-payment, lease complications, access issues, or costly turnover can be reviewed privately and purchased as-is."
  },
  {
    title: "Subject-To & Existing Finance",
    icon: Landmark,
    copy: "When equity, payoff, interest rate, or timing creates a challenge, we can evaluate acquisition structures that may include taking over existing financing where appropriate."
  },
  {
    title: "Seller Finance Options",
    icon: Signature,
    copy: "Some sellers need terms, not just a cash number. We can review whether seller financing creates a cleaner exit while protecting the owner's priorities."
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
    copy: "If ownership, probate, liens, payoff statements, judgments, or title questions are complicated, our closing partners help clarify the transaction path."
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
  "Institutional review process",
  "As-is acquisitions",
  "Cash and creative structures",
  "Closing partner coordination",
  "Clear written terms",
  "Private off-market sale"
];

export const faqs = [
  {
    question: "Do I need to make repairs before selling?",
    answer: "No. Red Clay Capital reviews properties as-is, including homes that need major repairs, cleanouts, or updates."
  },
  {
    question: "Can you buy a house with tenants?",
    answer: "Yes. We regularly evaluate rental properties, including situations involving difficult tenants, non-payment, or vacancy concerns."
  },
  {
    question: "Can you help with inherited property?",
    answer: "Yes. We can help families understand sale options for inherited homes and coordinate with appropriate closing professionals."
  },
  {
    question: "How fast can you close?",
    answer: "Closing timelines depend on title, access, and the homeowner's needs, but cash purchases can often move faster than traditional listings."
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
    answer: "Yes. We review damaged, neglected, outdated, and repair-heavy homes without requiring the owner to make improvements first."
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
    title: "How Subject-To and Seller Finance Sales Work",
    href: "/blog/subject-to-seller-finance-house-sale",
    copy: "A plain-English explanation of creative acquisition structures, when they may help, and what sellers should review carefully."
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
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sell-house-as-is-major-repairs",
    title: "Selling a House As-Is When Repairs Are Bigger Than the Budget",
    eyebrow: "Major repair properties",
    category: "Repairs",
    readTime: "7 min read",
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
          "This does not mean every as-is offer will be the highest possible number. It means the seller can compare a net, predictable option against the time, money, uncertainty, and stress of preparing the house for the open market."
        ]
      },
      {
        heading: "What Red Clay Capital reviews",
        body: [
          "Red Clay Capital reviews condition, access, neighborhood demand, repair scope, title status, occupancy, utilities, timeline, and closing constraints. We are not asking homeowners to make the property perfect before we look at it.",
          "For some sellers, the best option is still a traditional listing. For others, the cleaner decision is to accept a private as-is sale, avoid repair management, and close on a defined timeline."
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
    readTime: "8 min read",
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
          "Retail buyers usually want clean access, vacant delivery, financing approval, and an inspection process they can control. Difficult tenants can disrupt all four. Missed appointments, limited access, unknown interior condition, and lease uncertainty can reduce the buyer pool quickly.",
          "A professional acquisition review looks at rent status, lease terms, legal posture, property condition, local market demand, and the cost of resolving the issue after closing."
        ]
      },
      {
        heading: "A private sale can create a cleaner exit",
        body: [
          "Red Clay Capital can review tenant-occupied rentals, difficult occupant situations, inherited rentals, and properties where the owner no longer wants to manage the risk. The goal is not to minimize the problem. The goal is to price it honestly and determine whether an as-is sale creates a better outcome than continued management.",
          "Landlords should keep records organized: lease documents, payment history, notices, repair records, and communication history. Those details help clarify the situation and reduce uncertainty during review."
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
    readTime: "9 min read",
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
      }
    ],
    related: ["foreclosure-timeline-cash-sale-options", "sell-house-as-is-major-repairs"]
  },
  {
    slug: "sell-fire-damaged-house-north-carolina",
    title: "Selling a Fire-Damaged House in North Carolina",
    eyebrow: "Fire damage",
    category: "Damage",
    readTime: "7 min read",
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
          "Most retail buyers cannot or will not buy a fire-damaged home. Financing may be difficult, inspections can be uncertain, and the repair path may be too complex for a normal buyer.",
          "An acquisition buyer reviews the property based on current condition, repair scope, title, insurance status, local demand, and the cost of carrying the property through renovation or redevelopment."
        ]
      },
      {
        heading: "What to gather before requesting a review",
        body: [
          "Helpful information includes the property address, photos if available, whether utilities are active, insurance claim status, access details, known structural concerns, and any city or county notices.",
          "Red Clay Capital can review fire, smoke, water, and storm-damaged properties without asking the owner to make repairs before the conversation starts."
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
    readTime: "8 min read",
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
          "Red Clay Capital focuses on offers that can be explained and performed. When time is tight, certainty matters. A number that sounds good but cannot close before the deadline is not a solution.",
          "If a cash sale is a fit, the process should move quickly into title review, closing coordination, and written terms so the owner understands what happens next."
        ]
      }
    ],
    related: ["subject-to-seller-finance-house-sale", "sell-house-as-is-major-repairs"]
  },
  {
    slug: "sell-house-with-code-violations",
    title: "Selling a House With Code Violations, Liens, or City Notices",
    eyebrow: "Code and title issues",
    category: "Distress",
    readTime: "7 min read",
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
      }
    ],
    related: ["sell-fire-damaged-house-north-carolina", "sell-vacant-or-abandoned-house"]
  },
  {
    slug: "sell-inherited-house-with-multiple-heirs",
    title: "Selling an Inherited House When Multiple Heirs Are Involved",
    eyebrow: "Inherited property",
    category: "Probate",
    readTime: "8 min read",
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
      }
    ],
    related: ["sell-house-as-is-major-repairs", "sell-vacant-or-abandoned-house"]
  },
  {
    slug: "sell-vacant-or-abandoned-house",
    title: "Selling a Vacant or Abandoned House Before It Becomes a Bigger Problem",
    eyebrow: "Vacant homes",
    category: "Vacancy",
    readTime: "7 min read",
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
      }
    ],
    related: ["sell-house-with-code-violations", "sell-rental-property-with-bad-tenants"]
  }
];

export const servicePages = [
  {
    slug: "areas-we-serve",
    title: "Areas We Serve",
    eyebrow: "North Carolina property solutions",
    description:
      "Red Clay Capital helps homeowners throughout Raleigh, Durham, Cary, Chapel Hill, Burlington, Graham, Greensboro, Haw River, Roxboro, Fayetteville, Wilmington, and central North Carolina.",
    sections: [
      "Local market knowledge helps us evaluate timing, property condition, repairs, occupancy, and neighborhood demand with more context.",
      "Homeowners across central North Carolina can request a private review for inherited homes, distressed property, tenant issues, major repairs, vacancy, and other situations where a traditional listing may not be the right fit."
    ],
    keywords: ["cash home buyers Raleigh", "sell my house fast North Carolina", "cash buyers near me", "cash home buyers central North Carolina"]
  },
  {
    slug: "sell-your-house-fast",
    title: "Sell Your House Fast With a Professional Acquisition Process",
    eyebrow: "Private as-is acquisition",
    description:
      "Explore a private sale when you want to sell without repairs, showings, agent commissions, or a long listing timeline.",
    sections: [
      "A fast sale should still be structured. Red Clay Capital reviews the property, the situation, the timeline, title requirements, and closing logistics before discussing whether an acquisition proposal makes sense.",
      "This path can be useful for inherited homes, vacant properties, tenant issues, foreclosure pressure, damaged houses, fire damage, code issues, and properties where repairs no longer justify the delay."
    ],
    keywords: ["sell my house fast Raleigh NC", "cash offer for my house", "sell house as-is"]
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    eyebrow: "A clear process",
    description:
      "Tell us about the property, review your offer, and close on a timeline that works for you.",
    sections: [
      "Start with a private property review. You do not need to prepare the home, clean it out, or make repairs before reaching out.",
      "If the offer is a fit, closing is handled through professional closing partners with flexible dates and remote options when available."
    ],
    keywords: ["cash home buyers Raleigh", "sell without repairs", "remote closing"]
  },
  {
    slug: "about-red-clay-capital",
    title: "About Red Clay Capital",
    eyebrow: "Professional acquisitions firm",
    description:
      "Red Clay Capital is a North Carolina-focused real estate acquisitions company built for complex, as-is property situations.",
    sections: [
      "Red Clay Capital was formed around a simple market reality: many properties do not fit neatly into a traditional retail listing. Heavy repairs, tenant issues, inherited ownership, existing financing, vacancy, fire damage, code concerns, and title complications require a more specialized acquisition process.",
      "The company focuses on private off-market reviews, disciplined underwriting, clear written terms, and professional closing coordination. Sellers receive a practical option, not a sales pitch, and every transaction is evaluated for performance before an offer is presented."
    ],
    keywords: ["Red Clay Capital", "North Carolina acquisitions company", "professional cash home buyers"]
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    eyebrow: "Straight answers",
    description:
      "Helpful answers about repairs, tenants, inherited property, remote closings, timelines, and cash offer obligations.",
    sections: [
      "The most important thing to know is that requesting a review does not obligate you to accept an offer.",
      "Every property situation is different, so the best next step depends on title, condition, occupancy, timing, and the homeowner's goals."
    ],
    keywords: ["cash home buyer FAQ", "sell inherited house", "sell house with repairs"]
  },
  {
    slug: "contact",
    title: "Contact Red Clay Capital",
    eyebrow: "Acquisitions desk",
    description:
      "Contact Red Clay Capital to discuss an unwanted, inherited, damaged, vacant, financed, or tenant-occupied property.",
    sections: [
      "Email the acquisitions desk with the property address, occupancy status, known repairs, timeline, and any financing or title details that may matter.",
      "Your information is reviewed privately by the acquisitions desk, and the next step will be explained clearly before any decision is needed."
    ],
    keywords: ["contact Red Clay Capital", "cash offer for my house", "property review"]
  },
  {
    slug: "blog",
    title: "Homeowner Resource Center",
    eyebrow: "Distressed property education",
    description:
      "Guides for homeowners comparing as-is sales, cash offers, subject-to, seller finance, inherited property, repairs, tenants, fire damage, vacancy, and foreclosure concerns.",
    sections: [
      "The Red Clay Capital resource center is built for owners dealing with properties that require more than ordinary listing advice.",
      "Read practical, human-written guidance about as-is sales, cash offers, inherited properties, difficult tenants, subject-to structures, seller finance, fire damage, code issues, vacancy, foreclosure pressure, and remote closings."
    ],
    keywords: ["how cash home buyers work", "sell house as-is", "probate property guide"]
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    eyebrow: "Homeowner experiences",
    description:
      "Homeowner feedback reflects the kind of experience Red Clay Capital works to provide: clear communication, privacy, and a respectful process.",
    sections: [
      "Every conversation starts with the property, the situation, and the homeowner's goals.",
      "Our focus is a simple, low-pressure experience where homeowners understand their options before making a decision."
    ],
    keywords: ["Red Clay Capital reviews", "cash home buyer testimonials"]
  },
  {
    slug: "recently-purchased-properties",
    title: "Recently Purchased Properties",
    eyebrow: "Real examples",
    description:
      "Red Clay Capital works with a range of property situations, including inherited homes, repair-heavy houses, vacant properties, and tenant-occupied rentals.",
    sections: [
      "Privacy matters, so property examples are shared in a general way without exposing sensitive homeowner details.",
      "Common situations include homes needing major repairs, properties with occupancy challenges, and owners who need a simpler as-is sale."
    ],
    keywords: ["recently purchased homes", "as-is property buyer", "cash home buyer case studies"]
  },
  {
    slug: "our-buying-process",
    title: "Our Buying Process",
    eyebrow: "What to expect",
    description:
      "A transparent look at how Red Clay Capital reviews properties, evaluates repairs, discusses offers, and coordinates closing.",
    sections: [
      "We consider property condition, repairs, local market demand, title, occupancy, and closing timeline.",
      "The goal is to make the process clear enough that homeowners can compare their options with confidence."
    ],
    keywords: ["cash home buying process", "property review", "sell house fast process"]
  },
  {
    slug: "why-homeowners-choose-us",
    title: "Why Homeowners Choose Us",
    eyebrow: "Disciplined and professional",
    description:
      "Homeowners choose Red Clay Capital for private reviews, professional underwriting, clear terms, and practical solutions for complicated properties.",
    sections: [
      "We focus on the full situation behind the sale: title, occupancy, repairs, liens, financing, timeline, and closing feasibility.",
      "That means clear communication, flexible closing options, private off-market review, and no requirement to repair, clean, stage, or publicly show the property."
    ],
    keywords: ["why choose Red Clay Capital", "fair cash offer", "no pressure home buyer"]
  },
  {
    slug: "sell-house-with-subject-to-financing",
    title: "Sell a House With Subject-To Financing Options",
    eyebrow: "Creative acquisition structures",
    description:
      "Red Clay Capital can review existing loan terms, equity, payoff timing, and seller goals to determine whether a subject-to acquisition may be practical.",
    sections: [
      "Subject-to transactions require careful review because the existing financing may remain in place after closing. Sellers should understand loan terms, payment controls, insurance, risk, and documentation before agreeing to any structure.",
      "Red Clay Capital evaluates subject-to only when the structure appears workable for the property, the debt, and the seller's priorities. When cash is not the only useful option, a terms-based proposal may create flexibility that a standard offer cannot."
    ],
    keywords: ["sell house subject to", "subject to real estate North Carolina", "creative finance home buyer"]
  },
  {
    slug: "seller-finance-house-sale",
    title: "Seller Finance Property Sale Options",
    eyebrow: "Terms-based exits",
    description:
      "Learn how seller finance may help some homeowners sell with structured payments, written terms, and a private acquisition process.",
    sections: [
      "Seller finance can be useful when a seller wants a structured exit instead of a single cash payoff. The details matter: down payment, interest rate, monthly payment, maturity date, default remedies, security, and title requirements all affect whether the structure is acceptable.",
      "Red Clay Capital can review whether seller financing is a fit for the property and seller goals. Some situations call for cash. Others may benefit from terms that balance price, timing, and long-term payment structure."
    ],
    keywords: ["seller finance home buyer", "owner finance property sale", "sell house with terms"]
  },
  {
    slug: "sell-house-with-bad-tenants",
    title: "Sell a House With Difficult Tenants",
    eyebrow: "Tenant occupied acquisitions",
    description:
      "Red Clay Capital reviews rental properties with non-payment, access issues, lease complications, property damage, and stressful tenant situations.",
    sections: [
      "A tenant problem can turn a rental property into a liability. Missed rent, limited access, lease disputes, damage, unauthorized occupants, and turnover costs can make a traditional sale difficult.",
      "We evaluate the property as-is with the occupancy issue included. Sellers should be prepared to share lease documents, payment history, notices, repair records, and access details so the review can be realistic."
    ],
    keywords: ["sell house with bad tenants", "sell tenant occupied property", "problem tenant home buyer"]
  },
  {
    slug: "sell-fire-damaged-house",
    title: "Sell a Fire-Damaged House As-Is",
    eyebrow: "Fire and smoke damage",
    description:
      "Red Clay Capital evaluates fire-damaged, smoke-damaged, storm-damaged, and water-damaged homes without requiring repairs before review.",
    sections: [
      "Fire damage can involve smoke, water intrusion, electrical safety, structural concerns, permitting, insurance questions, and repair scope that many retail buyers cannot handle.",
      "A private as-is acquisition can help owners compare a clean sale against the cost, timeline, and uncertainty of repair management. Red Clay Capital reviews the full situation before discussing a proposal."
    ],
    keywords: ["sell fire damaged house", "cash buyer fire damaged house", "sell damaged house as-is"]
  },
  {
    slug: "sell-house-with-code-violations",
    title: "Sell a House With Code Violations or Liens",
    eyebrow: "Code, liens, and notices",
    description:
      "Explore a private sale option for properties with code violations, municipal notices, liens, unsafe conditions, or title complications.",
    sections: [
      "Code violations and municipal notices can make a normal sale harder. Buyers may hesitate, lenders may object, and owners may not know which items must be resolved before closing.",
      "Red Clay Capital reviews notices, lien information, repair exposure, access, occupancy, and title requirements to determine whether a direct acquisition can create a clean path forward."
    ],
    keywords: ["sell house with code violations", "sell house with liens", "cash buyer code violations"]
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
      "Graham homeowners can request a private property review for an as-is sale without repairs, cleanouts, public showings, or pressure.",
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
      "Red Clay Capital helps Greensboro homeowners explore fair cash offer options for inherited, distressed, tenant-occupied, or repair-heavy homes.",
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
      "Selling a house as-is in Haw River can help homeowners avoid repairs, cleaning, repeated showings, and uncertainty.",
      "Red Clay Capital reviews the full situation and provides a clear next step if a cash offer is a practical fit."
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
      "A private cash offer can be useful when you need a simpler sale without repairs, showings, or agent commissions.",
      "We help Roxboro homeowners understand their options and choose a timeline that fits the situation."
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
      "Graham homeowners can request a private property review for an as-is sale without repairs, cleanouts, or public showings.",
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
      "Red Clay Capital helps Greensboro homeowners explore fair cash offer options for inherited, distressed, tenant-occupied, or repair-heavy homes.",
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
