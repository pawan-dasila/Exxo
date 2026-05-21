export interface FAQQuestion {
  question: string;
  answer: string | string[];
  isImportant?: boolean;
}

export interface FAQSection {
  id: string;
  number: string;
  title: string;
  questions: FAQQuestion[];
}

export const FAQ_DATA: FAQSection[] = [
  {
    id: "general",
    number: "01",
    title: "General & Borrowing",
    questions: [
      {
        question: "What is EXXO and how does it work?",
        answer: [
          "EXXO is a premium peer-to-peer gear rental platform. Instead of buying expensive cameras, gadgets, outdoor gear, or ethnic wear that you only use occasionally, you can borrow them from trusted neighbors.",
          "Simply search for the item you need, select your rental dates, complete the secure checkout, and coordinate with the owner for pick-up or delivery. All payments are securely held in escrow until the rental is successfully completed."
        ],
        isImportant: true
      },
      {
        question: "How do I verify my identity to borrow?",
        answer: "To ensure community safety, all borrowers must complete a quick one-time ID verification using Aadhaar/Govt ID before their first booking is approved by the owner."
      },
      {
        question: "Is there a refundable security deposit?",
        answer: "Yes, some lenders require a refundable security deposit to cover minor damages or late returns. This deposit is securely held by EXXO and is instantly refunded to your original payment method once the item is returned in its original condition."
      }
    ]
  },
  {
    id: "lending",
    number: "02",
    title: "Lending & Earnings",
    questions: [
      {
        question: "How do I list my items on EXXO?",
        answer: "Click on 'List Your Item' in the navigation bar, upload clear photos of your item, set your desired daily rental rate, specify the security deposit (if any), and provide a detailed description and specification. Once approved, your listing will be visible to renters in your city."
      },
      {
        question: "What happens if my item is damaged or lost?",
        answer: "EXXO is built on trust and safety. In the rare event of damage, our support team mediates using pre-and post-rental photos. Minor repairs are covered under the security deposit. For major issues, EXXO's Damage Protection plan ensures you receive fair compensation.",
        isImportant: true
      },
      {
        question: "How and when do I get paid?",
        answer: "Earnings are accumulated in your EXXO wallet. Once a rental concludes successfully and the borrower returns the item, the funds are released from escrow and can be directly withdrawn to your registered bank account or UPI ID within 24-48 hours."
      }
    ]
  },
  {
    id: "handover",
    number: "03",
    title: "Handover & Logistics",
    questions: [
      {
        question: "How do I get the rented item?",
        answer: "Lenders specify their preferred handover method in the listing details. This can be either: (1) Self-pickup from the lender's location, or (2) Doorstep delivery coordinated via standard local hyper-local couriers (like Dunzo, Porter) at the borrower's cost."
      },
      {
        question: "What should I check during the handover?",
        answer: "We strongly recommend taking high-quality photos/videos of the item's condition at the exact moment of pickup and return. This protects both parties in case of any disputes regarding pre-existing wear and tear."
      },
      {
        question: "What happens if I return the item late?",
        answer: "Late returns inconvenience subsequent borrowers. A standard late fee equal to 1.5x the daily rental rate will be deducted from your security deposit for every day the item is delayed without prior extension approval from the lender."
      }
    ]
  },
  {
    id: "trust",
    number: "04",
    title: "Trust, Safety & Escrow",
    questions: [
      {
        question: "How does the Escrow payment model protect me?",
        answer: "When you pay for a booking, the money doesn't go directly to the lender. It is held securely in EXXO's Escrow account. The lender is only paid after you receive the item and verify it works as described, ensuring total peace of mind.",
        isImportant: true
      },
      {
        question: "Can I cancel a booking?",
        answer: "Yes, you can cancel a booking. Free cancellations are allowed up to 48 hours before the rental start time. Cancellations made within 48 hours are subject to a 50% cancellation fee to compensate the lender for holding the item."
      }
    ]
  }
];
