const Travel_Information = () => {
  const list = [
    "The reservation is for the following city: Montreal, YUL (CA)",
    "The travel period begins on Friday, May 8, 2026, and ends on Thursday, May 28, 2026.",
    "Travel is valid on Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday.",
    "For North America: 5% discount on standard fares and 10% discount on Flex fares or higher. For international travel: 10% discount on standard fares or higher. 12% discount on Business Class fares (exception: 5% discount on lowest Business Class fares).",
    "However, all bookings made using the promotional code will count toward the minimum requirement of 10 passengers for the Meetings and Events service",
  ];

  return (
    <div className=" container">
      <h2 className="text-2xl font-[700] mb-4">
        Air Canada – the Official Airline Carrier for ITA WTC2026 
      </h2>
      <h3 className="text-lg font-[500] leading-tight tracking-tighter mb-4">
        We are pleased to announce that Air Canada is the official airline
        carrier for the ITA WTC2026, taking place in Montréal from 15 to 21 May
        2026
      </h3>
      <h3 className="font-[500] mb-4">How To Take Advantage Of This Offer:</h3>
      <h3>
        When booking your ticket on aircanada.com simply enter the promotional
        code: VZAHB8F1. For details regarding fare conditions or booking
        procedures, please visit Air Canada’s official website or contact their
        customer service team. 
      </h3>
      <h3>
        We encourage you to plan your trip early to take full advantage of this
        exclusive offer. Applicable rules
      </h3>
      <ul className="list-disc px-12 mt-4">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Travel_Information;
