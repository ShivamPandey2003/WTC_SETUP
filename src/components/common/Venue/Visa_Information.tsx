const Visa_Information = () => {
  return (
    <div className=" container">
      <h1 className="text-2xl font-bold mb-3">
        Visa information : travelling to Canada
      </h1>
      <h3 className="text-lg font-[500] mb-3">
        Entry Requirements for Visitors to Canada
      </h3>
      <p className="mb-2">
        All visitors to Canada must present a valid passport and, in certain
        cases, a visa. In addition, Canada has introduced a new requirement for
        some international air travelers: the Electronic Travel Authorization
        (eTA). It is the responsibility of each visitor to ensure that they have
        the appropriate travel documents before entering the country.
      </p>
      <p className="mb-2">
        For complete information on entry requirements applicable to your
        country of residence, please consult the official website
        of Immigration, Refugees and Citizenship Canada(IRCC)
      </p>
      <p className="mb-2">
        If you require a visa, we strongly recommend that you begin the
        application process as soon as possible, as processing times may be
        lengthy
      </p>
      <p className="mb-2">
        {" "}
        When completing your conference registration, please indicate “Yes” in
        response to the question: “Do you need a letter of support for your visa
        application to come to Canada?
      </p>
      <p className="mb-2">
        Once your registration form and payment have been received and
        validated, the Conference Secretariat will send you a confirmation
        email. From this email, you can upload your visa support letter, which
        includes the code required for your visa application.
      </p>
      <p className="mb-2">
        {" "}
        Additionally, to coordinate your request, you may send your Immigration
        Canada application number to the Congress Secretariat. The visa
        application number can be found in the acknowledgement of receipt letter
        that is sent to the applicant after they apply. It will start with a V
        and will be followed by 9 digits (ex. V123456789).
      </p>
      <p className="mb-2">
        For detailed information on the documents required to enter Canada and
        the visa application process, please download and carefully review the
        document below.
      </p>
    </div>
  );
};

export default Visa_Information;
