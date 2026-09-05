export type MarketPage = {
  slug: string;
  state: string;
  abbreviation: string;
  title: string;
  description: string;
  introduction: string;
  sections: Array<{ heading: string; body: string[] }>;
  checklist: string[];
  sources: Array<{ label: string; href: string; description: string }>;
  guides: string[];
};

export const marketPages: MarketPage[] = [
  {
    slug: "north-carolina",
    state: "North Carolina",
    abbreviation: "NC",
    title: "Sell a House As-Is in North Carolina",
    description: "Explore a potential property sale in North Carolina. Compare repairs, inherited ownership, and timing with a clear offer review from Red Clay Capital.",
    introduction: "A home you inherited, a repair project, or a rental can leave you with more decisions than you expected. Start with what you know about the property and what you want the sale to accomplish.",
    sections: [
      {
        heading: "Compare the work of selling with the work of keeping it",
        body: ["For a North Carolina property, begin with the address, condition, occupancy, and preferred timing. We can discuss a potential sale before you organize repairs or a cleanout. A review is specific to the property; it does not guarantee an offer or a closing date.", "If you are comparing a direct offer with listing, put the expected sale proceeds beside the preparation, holding costs, and contract conditions of each option. A listing may reach more buyers and produce a higher price. A direct sale may suit an owner who wants to reduce preparation and showings, depending on the agreement."]
      },
      {
        heading: "Inherited property: start with authority, not a deadline",
        body: ["North Carolina’s Judicial Branch explains that estate administration generally runs through the clerk of superior court. It also explains that land and houses are not always administered through the probate estate. That distinction matters when a family is unsure who can sign or which documents are needed.", "Gather the deed, any will or estate appointment documents, and the names of the people involved. Ask a qualified North Carolina attorney or closing professional to confirm the authority required for your property before relying on a proposed sale date. The court’s estate guide below is a useful starting point."]
      },
      {
        heading: "Repairs and occupancy belong in the first conversation",
        body: ["Known roof, foundation, system, or water damage can affect a buyer’s evaluation. Share available estimates and tell us what has not been inspected. For an occupied rental, include the lease and access situation; do not assume a sale removes the need to address tenant rights or existing agreements.", "If you are managing the home from elsewhere, explain how a review could be arranged safely. You can begin with a manual address and a short description; professional photos are not required to request a conversation."]
      },
      {
        heading: "If a notice has a date on it, keep that process moving",
        body: ["A code notice, lender letter, or court paper deserves its own follow-up. North Carolina’s foreclosure procedures should not be inferred from another state’s rules. The Judicial Branch describes the process and available help; use your actual documents and qualified advice to establish the next step.", "Requesting an offer does not extend a deadline. Tell us about the timing while continuing to speak with the appropriate professional or issuing office."]
      }
    ],
    checklist: ["Property address and current occupancy", "Known repairs and available estimates", "Your preferred timing and any actual notices", "Ownership or estate questions to confirm"],
    sources: [
      { label: "North Carolina Judicial Branch: estates", href: "https://www.nccourts.gov/help-topics/wills-and-estates/estates", description: "Estate administration, property, and the clerk’s role." },
      { label: "North Carolina Judicial Branch: foreclosures", href: "https://www.nccourts.gov/help-topics/housing/foreclosures", description: "North Carolina procedures and available homeowner resources." }
    ],
    guides: ["sell-inherited-house-with-multiple-heirs", "sell-house-as-is-major-repairs", "understanding-an-investor-offer"]
  },
  {
    slug: "georgia",
    state: "Georgia",
    abbreviation: "GA",
    title: "Explore an As-Is Property Sale in Georgia",
    description: "Considering selling a Georgia house, inherited property, or rental? Organize your questions and request a property-specific review from Red Clay Capital.",
    introduction: "If coordinating an estate, maintaining a vacant home, or managing a rental is taking more time than you can give it, compare a possible sale with the cost and effort of your next few months.",
    sections: [
      {
        heading: "A useful starting point for a Georgia property",
        body: ["Share the full property location and the outcome you want. We consider inquiries in Georgia and confirm whether a property is a practical fit after review. This page does not imply an office in your city or that a purchase is available at every address.", "A useful comparison starts with actual carrying costs, known repairs, occupancy, and your available time. If the home could be marketed to a wider buyer pool, a listing estimate can help you weigh a potential direct offer fairly."]
      },
      {
        heading: "For an inherited home, organize the people and the documents",
        body: ["When several relatives are involved, first separate family preferences from the question of who can legally authorize a sale. Make one list of the people to consult and another of the documents already available: a deed, will, court papers, loan information, and known property expenses.", "Georgia.gov explains the role of an executor and probate court in its will guidance. The Georgia Courts directory can help you find the relevant court. Ask an appropriate Georgia professional which process applies to the property; do not use a North Carolina estate checklist as a substitute for that answer."]
      },
      {
        heading: "A rental sale needs a clear handoff",
        body: ["If the property has tenants, bring the lease, amendments, rent ledger, deposit records, and outstanding maintenance requests together before evaluating offers. Tell a prospective buyer whether access is available and which facts have not yet been confirmed.", "Compare selling occupied with continuing to manage the property until an appropriate turnover. Consider repairs, the possibility of vacancy, and your own time. Have a qualified local adviser explain access, notices, and tenant obligations instead of assuming the buyer can resolve everything after closing."]
      },
      {
        heading: "Understand the proposal before choosing a date",
        body: ["Ask for a written explanation of the buyer, price, costs, inspection conditions, and target date. If a partner, assignment, or payment arrangement is proposed, have the structure and responsibilities explained before signing.", "For a property you manage from another state, ask the closing professional early about signing and identity-verification arrangements. Remote completion and a particular date need confirmation for the specific transaction."]
      }
    ],
    checklist: ["Full address and county, if known", "Lease and access details for an occupied rental", "Estate documents and decision-makers, if inherited", "Monthly property expenses and your preferred timing"],
    sources: [
      { label: "Georgia Courts directory", href: "https://georgiacourts.gov/georgia-courts-directory/", description: "Find the appropriate court and its current contact information." },
      { label: "Georgia.gov: wills and executor responsibilities", href: "https://georgia.gov/write-will", description: "An official introduction to wills, executors, and probate court." }
    ],
    guides: ["sell-rental-property-with-bad-tenants", "sell-inherited-house-with-multiple-heirs", "sell-vacant-or-abandoned-house"]
  },
  {
    slug: "ohio",
    state: "Ohio",
    abbreviation: "OH",
    title: "Compare As-Is Home Sale Options in Ohio",
    description: "Review the options for an Ohio house with repairs, vacancy, or inherited ownership. Request a potential offer and understand the steps before a sale.",
    introduction: "An unused house still takes money and attention. If your Ohio property needs work or no longer fits your plans, start by comparing a sale with the repairs, upkeep, and decisions involved in keeping it.",
    sections: [
      {
        heading: "Make a property-specific comparison",
        body: ["Red Clay Capital accepts property inquiries in Ohio for review. Location, condition, access, occupancy, and the proposed terms determine whether a potential offer is a fit. We do not promise a purchase for every house or claim an office in each city.", "Separate work that needs attention now from improvements you might make to attract a retail buyer. Obtain estimates where practical, keep unknowns visible, and compare them with the written conditions of an as-is proposal."]
      },
      {
        heading: "Vacancy: turn an open-ended responsibility into a plan",
        body: ["List the real costs of keeping the property for another three months: taxes, insurance, utilities, grounds care, management, and repairs already identified. Ask your insurer whether the current occupancy changes coverage, and arrange safe oversight of the property.", "An owner who lives elsewhere may value reduced coordination; another owner may prefer to complete repairs and list. Compare both using estimated net proceeds and the work required. Tell us how access can be arranged, without putting keys or entry codes in the initial inquiry."]
      },
      {
        heading: "For an estate property, use Ohio resources",
        body: ["The Supreme Court of Ohio publishes estate forms covering matters such as authority to administer an estate and consent to a power to sell real estate. The existence of a form does not mean it applies to every inherited home.", "Ask the relevant probate court or a qualified Ohio attorney what is required for the actual ownership and estate circumstances. Keep the deed and any court appointment documents available. Family agreement, a will, and authority to sign a property transfer are questions to confirm before making a closing commitment."]
      },
      {
        heading: "A repair estimate is only one part of an offer",
        body: ["A potential buyer may also account for holding costs, the time needed for work, resale expenses, and uncertainty about uninspected systems. Ask how these assumptions affect the proposal and whether an inspection could change the price.", "Compare the named buyer, conditions, cost allocation, and proposed date in writing. Any investor partner or assignment should be explained. You can request a review while you are still gathering information; submitting details does not accept an offer."]
      }
    ],
    checklist: ["Address, occupancy, and safe access arrangements", "Known repairs and what remains uninspected", "Costs of maintaining the home while you decide", "Deed and estate authority questions, if relevant"],
    sources: [
      { label: "Supreme Court of Ohio: decedent’s estate forms", href: "https://www.supremecourt.ohio.gov/forms/all-forms/decedents-estate/8", description: "Official estate forms; confirm applicability with the relevant court or your adviser." },
      { label: "CFPB: mortgage help", href: "https://www.consumerfinance.gov/mortgagehelp/", description: "Independent help finding a HUD-approved housing counselor if mortgage payments are a concern." }
    ],
    guides: ["sell-vacant-or-abandoned-house", "sell-house-as-is-major-repairs", "understanding-an-investor-offer"]
  }
];

export const cityGuidance: Record<string, { heading: string; paragraphs: string[]; checklist: string[]; guide: string }> = {
  "raleigh-nc": {
    heading: "Compare a direct offer with a listing estimate",
    paragraphs: ["For a Raleigh property, an offer is most useful when you can compare it with another realistic path. A listing may reach a wider buyer pool, while a direct proposal may reduce preparation or showings. Neither path should be judged on headline price alone.", "Create two estimates of what you may keep after agreed selling costs, repairs, credits, and the expense of holding the home. Ask how inspection conditions and timing could change each result. We review your address and circumstances before discussing whether a proposal is possible."],
    checklist: ["Written offer or listing estimate, if available", "Known work needed before marketing", "Costs you would pay under each option"], guide: "understanding-an-investor-offer"
  },
  "durham-nc": {
    heading: "Plan for a tenant-occupied sale",
    paragraphs: ["If you are considering selling an occupied Durham rental, organize the lease, rent ledger, deposits, and outstanding maintenance before comparing proposals. Separate facts you can document from access or condition questions that still need confirmation.", "Ask how a buyer would evaluate an occupied property, who would coordinate permitted access, and what possession the agreement requires. A sale still needs to account for tenant rights and lease obligations. Compare selling occupied with the work and costs of an appropriate turnover."],
    checklist: ["Lease, amendments, and rent records", "Known repairs and outstanding requests", "Access arrangements to confirm"], guide: "sell-rental-property-with-bad-tenants"
  },
  "cary-nc": {
    heading: "Decide which preparation is worth doing",
    paragraphs: ["Before preparing a Cary house for sale, separate cosmetic improvements from known system or structural work. Then compare estimates with the time you want to spend managing the project. A request for review can begin before renovation or staging.", "Ask a prospective buyer whether the offer reflects the property’s current condition and what inspections remain. Ask a listing professional what preparation could reasonably change the marketing plan. These are different estimates to weigh against your priorities; neither guarantees a final price."],
    checklist: ["Repair and update estimates", "Work you are willing to manage", "Desired timing and room for delays"], guide: "sell-house-as-is-major-repairs"
  },
  "chapel-hill-nc": {
    heading: "Coordinate an inherited home without rushing the family",
    paragraphs: ["An inherited Chapel Hill property can involve several people and different preferences about repairs, belongings, and timing. Start with a shared list of decisions and a separate list of ownership questions that need professional confirmation.", "In North Carolina, real property is not always administered through the probate estate. The state court guide linked from our North Carolina hub explains the distinction. Have the appropriate attorney or closing professional confirm authority to sign, then compare sale options with the people who need to be involved."],
    checklist: ["Deed and estate appointment documents", "People involved in the decision", "Belongings, occupancy, and timing to coordinate"], guide: "sell-inherited-house-with-multiple-heirs"
  },
  "fayetteville-nc": {
    heading: "Work backward from a move",
    paragraphs: ["If a move is the reason for selling a Fayetteville property, write down the desired moving date, the costs of overlap, and what flexibility you have. A preferred date is useful information, but it is not a closing guarantee.", "Ask each prospective buyer about inspection, title, financing, and signing conditions that still need to be completed. If you will leave before closing, ask the closing professional how signing and property access could work. Compare keeping the home temporarily with a proposal you can realistically complete."],
    checklist: ["Moving date and flexibility", "Expected overlap and carrying expenses", "Signing and access questions if you leave early"], guide: "understanding-an-investor-offer"
  },
  "wilmington-nc": {
    heading: "Organize a sale after water or storm damage",
    paragraphs: ["For a Wilmington property with water or storm damage, start with what has been professionally assessed and what remains unknown. A buyer may need repair reports, safe access, and an explanation of any active insurance claim.", "Ask your insurer and relevant professionals how a proposed transfer affects the claim and any required work. Keep an insurance expectation separate from a written purchase offer. You can request a review without entering an unsafe area or completing repairs first."],
    checklist: ["Available professional damage reports", "Claim status and questions for the insurer", "Current safety or access restrictions"], guide: "sell-fire-damaged-house-north-carolina"
  },
  "burlington-nc": {
    heading: "Compare repairs with an as-is proposal",
    paragraphs: ["If a Burlington home needs more work than you want to manage, list the known repairs and the items that have not been inspected. Separate written estimates from guesses so you can see where a buyer may price uncertainty.", "Compare an as-is proposal with the costs and time of preparing a listing. Ask which expenses remain yours, whether the offer depends on further inspection, and how a repair finding could change the terms. A review begins with the property as it is today."],
    checklist: ["Known repairs and available estimates", "Uninspected systems or areas", "Offer conditions and seller costs"], guide: "sell-house-as-is-major-repairs"
  },
  "graham-nc": {
    heading: "Get a clear plan for an unwanted property",
    paragraphs: ["If you no longer want to maintain a Graham property, compare the next few months of ownership with a potential sale. Use actual expenses for taxes, insurance, utilities, maintenance, and management where available.", "Decide how much preparation you are willing to organize and what timing would help. A prospective buyer needs to understand occupancy and access as well as repairs. Ask for written cost and closing conditions so you can judge the proposed exit against keeping or listing the home."],
    checklist: ["Recurring expenses and maintenance needs", "Occupancy and safe access", "Preparation you want to avoid or can manage"], guide: "sell-vacant-or-abandoned-house"
  },
  "greensboro-nc": {
    heading: "Separate the rental’s finances from the work it requires",
    paragraphs: ["When comparing a sale of a Greensboro rental, start with current rent, actual expenses, known repairs, and the time management takes. A property can require more attention than an owner wants even when it produces income.", "Gather the lease, deposit and payment records, and any pending maintenance requests. Ask a buyer to explain assumptions about occupancy and access. Compare an occupied sale with continuing to manage or waiting for an appropriate turnover, while confirming tenant obligations with a qualified adviser."],
    checklist: ["Rent and expense records", "Lease and deposit documentation", "Management effort and pending repairs"], guide: "sell-rental-property-with-bad-tenants"
  },
  "haw-river-nc": {
    heading: "Make an inherited-property checklist",
    paragraphs: ["For an inherited Haw River home, divide the first steps into property care, belongings, and authority to sell. Keeping these separate helps a family compare sale options without confusing a preferred outcome with legal permission to sign.", "Gather the deed and any estate papers, then ask an appropriate North Carolina professional who needs to participate and which requirements apply. Once those questions are clearer, compare a potential direct offer with the work of clearing, repairing, and listing the property."],
    checklist: ["Deed and available estate papers", "Belongings and property-care arrangements", "People whose authority or participation needs confirmation"], guide: "sell-inherited-house-with-multiple-heirs"
  },
  "roxboro-nc": {
    heading: "Manage distance and vacancy before choosing an offer",
    paragraphs: ["If you live away from a Roxboro property, account for the effort of checking on it, arranging access, and responding to maintenance. List recurring expenses and ask your insurer about the current occupancy status.", "A sale comparison should include how much coordination each option requires. Tell a prospective buyer how access could be arranged safely, what repairs are known, and what information is missing. Do not share entry codes in the initial inquiry; arrange a suitable way to provide access later."],
    checklist: ["Current occupancy and oversight", "Known maintenance and recurring costs", "A safe plan for property access"], guide: "sell-vacant-or-abandoned-house"
  }
};
