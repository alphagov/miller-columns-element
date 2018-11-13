describe('govuk-miller-columns', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('govuk-miller-columns')
      assert.equal('GOVUK-MILLER-COLUMNS', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.MillerColumnsElement()
      assert.equal('GOVUK-MILLER-COLUMNS', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    beforeEach(function() {
      const container = document.createElement('div')
      container.innerHTML = `
        <govuk-miller-columns id="miller-columns" for="taxonomy" breadcrumbs="selected-items">
        <ul id="taxonomy">
        <li>
           <div class="govuk-checkboxes__item">
              <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473" tabindex="-1">
              <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label">
              Parenting, childcare and children's services
              </label>
           </div>
           <ul>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" tabindex="-1">
                    <label for="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-label govuk-checkboxes__label">
                    Divorce, separation and legal issues
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-checkboxes__input" name="topics[]" value="9ed56732-8600-493e-8467-295233529718" tabindex="-1">
                          <label for="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-label govuk-checkboxes__label">
                          Child custody
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-checkboxes__input" name="topics[]" value="237b2e72-c465-42fe-9293-8b6af21713c0" tabindex="-1">
                          <label for="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-label govuk-checkboxes__label">
                          Disagreements about parentage
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-902af4ff-4a3b-4860-932a-f7d9a47c337e" class="govuk-checkboxes__input" name="topics[]" value="902af4ff-4a3b-4860-932a-f7d9a47c337e" tabindex="-1">
                          <label for="topic-902af4ff-4a3b-4860-932a-f7d9a47c337e" class="govuk-label govuk-checkboxes__label">
                          Child maintenance
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-checkboxes__input" name="topics[]" value="f1d9c348-5c5e-4fc6-9172-13a62537d3ae" tabindex="-1">
                    <label for="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-label govuk-checkboxes__label">
                    Childcare and early years
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-checkboxes__input" name="topics[]" value="1da1c700-cef8-45c4-9bb7-11a4b0003e10" tabindex="-1">
                          <label for="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-label govuk-checkboxes__label">
                          Local authorities and early years
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-62562899-fed3-4876-ba61-80264d140009" class="govuk-checkboxes__input" name="topics[]" value="62562899-fed3-4876-ba61-80264d140009" tabindex="-1">
                          <label for="topic-62562899-fed3-4876-ba61-80264d140009" class="govuk-label govuk-checkboxes__label">
                          Finding childcare
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-18cb575a-45a0-4ab8-8bff-12c48a2ee8d4" class="govuk-checkboxes__input" name="topics[]" value="18cb575a-45a0-4ab8-8bff-12c48a2ee8d4" tabindex="-1">
                          <label for="topic-18cb575a-45a0-4ab8-8bff-12c48a2ee8d4" class="govuk-label govuk-checkboxes__label">
                          Providing childcare
                          </label>
                       </div>
                       <ul>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-89b2ca59-0a37-4576-b226-95bde1e9efc4" class="govuk-checkboxes__input" name="topics[]" value="89b2ca59-0a37-4576-b226-95bde1e9efc4" tabindex="-1">
                                <label for="topic-89b2ca59-0a37-4576-b226-95bde1e9efc4" class="govuk-label govuk-checkboxes__label">
                                Funding and finance for childcare providers
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-457ca0a6-6532-41a8-85a7-b063bf1db08b" class="govuk-checkboxes__input" name="topics[]" value="457ca0a6-6532-41a8-85a7-b063bf1db08b" tabindex="-1">
                                <label for="topic-457ca0a6-6532-41a8-85a7-b063bf1db08b" class="govuk-label govuk-checkboxes__label">
                                Children's centres, childminders, pre-schools and nurseries
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-b52d05ab-bc36-4a68-9bbf-63417788af3c" class="govuk-checkboxes__input" name="topics[]" value="b52d05ab-bc36-4a68-9bbf-63417788af3c" tabindex="-1">
                                <label for="topic-b52d05ab-bc36-4a68-9bbf-63417788af3c" class="govuk-label govuk-checkboxes__label">
                                Performance and inspection of childcare providers
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-6a1688d6-c0ed-4b2f-a5ea-aac3748c8394" class="govuk-checkboxes__input" name="topics[]" value="6a1688d6-c0ed-4b2f-a5ea-aac3748c8394" tabindex="-1">
                                <label for="topic-6a1688d6-c0ed-4b2f-a5ea-aac3748c8394" class="govuk-label govuk-checkboxes__label">
                                Recruiting and managing early years staff
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-39e60ce9-5b21-49e9-919f-2cf3ffa4b075" class="govuk-checkboxes__input" name="topics[]" value="39e60ce9-5b21-49e9-919f-2cf3ffa4b075" tabindex="-1">
                                <label for="topic-39e60ce9-5b21-49e9-919f-2cf3ffa4b075" class="govuk-label govuk-checkboxes__label">
                                Becoming a childcare provider
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-b508d8eb-de70-4e08-b7d9-9e4a9f5bedae" class="govuk-checkboxes__input" name="topics[]" value="b508d8eb-de70-4e08-b7d9-9e4a9f5bedae" tabindex="-1">
                                <label for="topic-b508d8eb-de70-4e08-b7d9-9e4a9f5bedae" class="govuk-label govuk-checkboxes__label">
                                Early years curriculum (0 to 5)
                                </label>
                             </div>
                          </li>
                       </ul>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-4713d510-9dd1-479f-a2f3-9b2ec5cde0e3" class="govuk-checkboxes__input" name="topics[]" value="4713d510-9dd1-479f-a2f3-9b2ec5cde0e3" tabindex="-1">
                          <label for="topic-4713d510-9dd1-479f-a2f3-9b2ec5cde0e3" class="govuk-label govuk-checkboxes__label">
                          Data collection for early years and childcare
                          </label>
                       </div>
                       <ul>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-5a73303d-0c74-4115-9c3e-7d0e925cb1ae" class="govuk-checkboxes__input" name="topics[]" value="5a73303d-0c74-4115-9c3e-7d0e925cb1ae" tabindex="-1">
                                <label for="topic-5a73303d-0c74-4115-9c3e-7d0e925cb1ae" class="govuk-label govuk-checkboxes__label">
                                Early years census
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-84230b48-93db-45f9-a374-0a82bba90f4e" class="govuk-checkboxes__input" name="topics[]" value="84230b48-93db-45f9-a374-0a82bba90f4e" tabindex="-1">
                                <label for="topic-84230b48-93db-45f9-a374-0a82bba90f4e" class="govuk-label govuk-checkboxes__label">
                                Early years foundation stage profile return
                                </label>
                             </div>
                          </li>
                       </ul>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-a44b1c68-807c-45fe-bc7b-a47586617863" class="govuk-checkboxes__input" name="topics[]" value="a44b1c68-807c-45fe-bc7b-a47586617863" tabindex="-1">
                    <label for="topic-a44b1c68-807c-45fe-bc7b-a47586617863" class="govuk-label govuk-checkboxes__label">
                    Financial help if you have children
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-7a2b6588-d734-4057-8d2f-f80a47123f17" class="govuk-checkboxes__input" name="topics[]" value="7a2b6588-d734-4057-8d2f-f80a47123f17" tabindex="-1">
                          <label for="topic-7a2b6588-d734-4057-8d2f-f80a47123f17" class="govuk-label govuk-checkboxes__label">
                          Financial help if you have a disabled child
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-c73891d9-1ead-4075-8681-8189de727cb9" class="govuk-checkboxes__input" name="topics[]" value="c73891d9-1ead-4075-8681-8189de727cb9" tabindex="-1">
                          <label for="topic-c73891d9-1ead-4075-8681-8189de727cb9" class="govuk-label govuk-checkboxes__label">
                          Child benefit
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-090f8b0b-02f6-446b-b2ec-6000d7cd8322" class="govuk-checkboxes__input" name="topics[]" value="090f8b0b-02f6-446b-b2ec-6000d7cd8322" tabindex="-1">
                          <label for="topic-090f8b0b-02f6-446b-b2ec-6000d7cd8322" class="govuk-label govuk-checkboxes__label">
                          Financial help when having a baby
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-65a25d2c-a0e5-4283-921d-c928babfb6e4" class="govuk-checkboxes__input" name="topics[]" value="65a25d2c-a0e5-4283-921d-c928babfb6e4" tabindex="-1">
                          <label for="topic-65a25d2c-a0e5-4283-921d-c928babfb6e4" class="govuk-label govuk-checkboxes__label">
                          Tax credits if you have children
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-7966b917-60ea-4276-981e-84c59dfc5f7a" class="govuk-checkboxes__input" name="topics[]" value="7966b917-60ea-4276-981e-84c59dfc5f7a" tabindex="-1">
                          <label for="topic-7966b917-60ea-4276-981e-84c59dfc5f7a" class="govuk-label govuk-checkboxes__label">
                          Savings accounts for children
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-9797d693-65f2-4e74-b652-2dae0ce7e4d4" class="govuk-checkboxes__input" name="topics[]" value="9797d693-65f2-4e74-b652-2dae0ce7e4d4" tabindex="-1">
                          <label for="topic-9797d693-65f2-4e74-b652-2dae0ce7e4d4" class="govuk-label govuk-checkboxes__label">
                          Financial help if you're a student with children
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-6391a4bc-6109-4da4-b311-f78954334969" class="govuk-checkboxes__input" name="topics[]" value="6391a4bc-6109-4da4-b311-f78954334969" tabindex="-1">
                          <label for="topic-6391a4bc-6109-4da4-b311-f78954334969" class="govuk-label govuk-checkboxes__label">
                          Financial support for childcare
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-5a9e6b26-ae64-4129-93ee-968028381e83" class="govuk-checkboxes__input" name="topics[]" value="5a9e6b26-ae64-4129-93ee-968028381e83" tabindex="-1">
                    <label for="topic-5a9e6b26-ae64-4129-93ee-968028381e83" class="govuk-label govuk-checkboxes__label">
                    Adoption, fostering and surrogacy
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-13bba81c-b2b1-4b13-a3de-b24748977198" class="govuk-checkboxes__input" name="topics[]" value="13bba81c-b2b1-4b13-a3de-b24748977198" tabindex="-1">
                          <label for="topic-13bba81c-b2b1-4b13-a3de-b24748977198" class="govuk-label govuk-checkboxes__label">
                          Adoption
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-b42ec0f9-d161-4be6-85c5-bf3933c1cca4" class="govuk-checkboxes__input" name="topics[]" value="b42ec0f9-d161-4be6-85c5-bf3933c1cca4" tabindex="-1">
                          <label for="topic-b42ec0f9-d161-4be6-85c5-bf3933c1cca4" class="govuk-label govuk-checkboxes__label">
                          Intercountry adoption
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-f40a63ce-ac0c-4102-84d1-f1835cb7daac" class="govuk-checkboxes__input" name="topics[]" value="f40a63ce-ac0c-4102-84d1-f1835cb7daac" tabindex="-1">
                          <label for="topic-f40a63ce-ac0c-4102-84d1-f1835cb7daac" class="govuk-label govuk-checkboxes__label">
                          Fostering
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-29698d17-8ce4-46e6-b173-bde2b5977970" class="govuk-checkboxes__input" name="topics[]" value="29698d17-8ce4-46e6-b173-bde2b5977970" tabindex="-1">
                          <label for="topic-29698d17-8ce4-46e6-b173-bde2b5977970" class="govuk-label govuk-checkboxes__label">
                          Special guardianship
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-b0c0b3c6-6ee2-4fce-9abd-4a73be10c483" class="govuk-checkboxes__input" name="topics[]" value="b0c0b3c6-6ee2-4fce-9abd-4a73be10c483" tabindex="-1">
                          <label for="topic-b0c0b3c6-6ee2-4fce-9abd-4a73be10c483" class="govuk-label govuk-checkboxes__label">
                          Surrogacy
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-2389dfd4-a0c4-4bd2-b7e6-06f465463d22" class="govuk-checkboxes__input" name="topics[]" value="2389dfd4-a0c4-4bd2-b7e6-06f465463d22" tabindex="-1">
                    <label for="topic-2389dfd4-a0c4-4bd2-b7e6-06f465463d22" class="govuk-label govuk-checkboxes__label">
                    Children's health and welfare
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-44509d44-824f-40a2-babe-6388b6136b7b" class="govuk-checkboxes__input" name="topics[]" value="44509d44-824f-40a2-babe-6388b6136b7b" tabindex="-1">
                          <label for="topic-44509d44-824f-40a2-babe-6388b6136b7b" class="govuk-label govuk-checkboxes__label">
                          Support for children with special educational needs and disabilities (SEND)
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-4f72853c-d9ea-4b34-a986-2f62359e9e40" class="govuk-checkboxes__input" name="topics[]" value="4f72853c-d9ea-4b34-a986-2f62359e9e40" tabindex="-1">
                          <label for="topic-4f72853c-d9ea-4b34-a986-2f62359e9e40" class="govuk-label govuk-checkboxes__label">
                          Children's rights
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-0edc28be-da72-4b33-8ecf-e83455eeaced" class="govuk-checkboxes__input" name="topics[]" value="0edc28be-da72-4b33-8ecf-e83455eeaced" tabindex="-1">
                          <label for="topic-0edc28be-da72-4b33-8ecf-e83455eeaced" class="govuk-label govuk-checkboxes__label">
                          Mental health of children and young people
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-fc2412f2-77d1-4559-96db-b467cda93990" class="govuk-checkboxes__input" name="topics[]" value="fc2412f2-77d1-4559-96db-b467cda93990" tabindex="-1">
                          <label for="topic-fc2412f2-77d1-4559-96db-b467cda93990" class="govuk-label govuk-checkboxes__label">
                          Help for children with a long-term illness or disability
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-eb6c325f-09b7-4873-86f0-6b2eacc4d27f" class="govuk-checkboxes__input" name="topics[]" value="eb6c325f-09b7-4873-86f0-6b2eacc4d27f" tabindex="-1">
                          <label for="topic-eb6c325f-09b7-4873-86f0-6b2eacc4d27f" class="govuk-label govuk-checkboxes__label">
                          Child poverty
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-43fcdde6-59c5-487f-a969-a046b334cbec" class="govuk-checkboxes__input" name="topics[]" value="43fcdde6-59c5-487f-a969-a046b334cbec" tabindex="-1">
                    <label for="topic-43fcdde6-59c5-487f-a969-a046b334cbec" class="govuk-label govuk-checkboxes__label">
                    Youth employment and social issues
                    </label>
                 </div>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-e4335adc-5dc3-47c0-bb27-4998792212eb" class="govuk-checkboxes__input" name="topics[]" value="e4335adc-5dc3-47c0-bb27-4998792212eb" tabindex="-1">
                    <label for="topic-e4335adc-5dc3-47c0-bb27-4998792212eb" class="govuk-label govuk-checkboxes__label">
                    Pregnancy and birth
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-8da62d85-47c0-42df-94c4-eaaeac329671" class="govuk-checkboxes__input" name="topics[]" value="8da62d85-47c0-42df-94c4-eaaeac329671" tabindex="-1">
                          <label for="topic-8da62d85-47c0-42df-94c4-eaaeac329671" class="govuk-label govuk-checkboxes__label">
                          Register the birth of a child
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-1bd8be6f-fe5b-4b0b-a780-db1d873951b4" class="govuk-checkboxes__input" name="topics[]" value="1bd8be6f-fe5b-4b0b-a780-db1d873951b4" tabindex="-1">
                          <label for="topic-1bd8be6f-fe5b-4b0b-a780-db1d873951b4" class="govuk-label govuk-checkboxes__label">
                          Working and time off when you're having a baby
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-20eb4e84-98ee-404b-a4bd-fe8a36d5d71d" class="govuk-checkboxes__input" name="topics[]" value="20eb4e84-98ee-404b-a4bd-fe8a36d5d71d" tabindex="-1">
                    <label for="topic-20eb4e84-98ee-404b-a4bd-fe8a36d5d71d" class="govuk-label govuk-checkboxes__label">
                    Safeguarding and social care for children
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-df68fd4e-8e6f-4473-a24a-6033d65fb1d0" class="govuk-checkboxes__input" name="topics[]" value="df68fd4e-8e6f-4473-a24a-6033d65fb1d0" tabindex="-1">
                          <label for="topic-df68fd4e-8e6f-4473-a24a-6033d65fb1d0" class="govuk-label govuk-checkboxes__label">
                          Child and family social work
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-5af6180c-d5db-4cc1-a68e-7bd066908132" class="govuk-checkboxes__input" name="topics[]" value="5af6180c-d5db-4cc1-a68e-7bd066908132" tabindex="-1">
                          <label for="topic-5af6180c-d5db-4cc1-a68e-7bd066908132" class="govuk-label govuk-checkboxes__label">
                          Safeguarding and child protection
                          </label>
                       </div>
                       <ul>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-d36f331f-ef4e-48e2-81e5-c4ed6c94a1f9" class="govuk-checkboxes__input" name="topics[]" value="d36f331f-ef4e-48e2-81e5-c4ed6c94a1f9" tabindex="-1">
                                <label for="topic-d36f331f-ef4e-48e2-81e5-c4ed6c94a1f9" class="govuk-label govuk-checkboxes__label">
                                Data collection for safeguarding and child protection
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-d58bd4de-3fee-4953-9654-7551333eebf1" class="govuk-checkboxes__input" name="topics[]" value="d58bd4de-3fee-4953-9654-7551333eebf1" tabindex="-1">
                                <label for="topic-d58bd4de-3fee-4953-9654-7551333eebf1" class="govuk-label govuk-checkboxes__label">
                                Child abduction and cross-border child protection
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-e626b2fd-203e-4e2e-b8a5-121896ae22e7" class="govuk-checkboxes__input" name="topics[]" value="e626b2fd-203e-4e2e-b8a5-121896ae22e7" tabindex="-1">
                                <label for="topic-e626b2fd-203e-4e2e-b8a5-121896ae22e7" class="govuk-label govuk-checkboxes__label">
                                Serious case reviews
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-fbe2ce17-9ee6-4dcb-a523-ae5383d2cf4c" class="govuk-checkboxes__input" name="topics[]" value="fbe2ce17-9ee6-4dcb-a523-ae5383d2cf4c" tabindex="-1">
                                <label for="topic-fbe2ce17-9ee6-4dcb-a523-ae5383d2cf4c" class="govuk-label govuk-checkboxes__label">
                                Refugee, runaway and homeless children
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-47fbdb87-b4ff-432a-a4cf-a2f2468ff6d4" class="govuk-checkboxes__input" name="topics[]" value="47fbdb87-b4ff-432a-a4cf-a2f2468ff6d4" tabindex="-1">
                                <label for="topic-47fbdb87-b4ff-432a-a4cf-a2f2468ff6d4" class="govuk-label govuk-checkboxes__label">
                                Preventing neglect, abuse and exploitation
                                </label>
                             </div>
                          </li>
                       </ul>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-431a7fac-a2e8-4ffc-8fc7-bab10fc5e6d4" class="govuk-checkboxes__input" name="topics[]" value="431a7fac-a2e8-4ffc-8fc7-bab10fc5e6d4" tabindex="-1">
                          <label for="topic-431a7fac-a2e8-4ffc-8fc7-bab10fc5e6d4" class="govuk-label govuk-checkboxes__label">
                          Looked-after children and children in care
                          </label>
                       </div>
                       <ul>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-c5b994b2-29dd-4c7a-973d-3eee43a60c2d" class="govuk-checkboxes__input" name="topics[]" value="c5b994b2-29dd-4c7a-973d-3eee43a60c2d" tabindex="-1">
                                <label for="topic-c5b994b2-29dd-4c7a-973d-3eee43a60c2d" class="govuk-label govuk-checkboxes__label">
                                Health, wellbeing and education of looked-after children
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-c359fa76-88ff-4298-817e-5cf974473853" class="govuk-checkboxes__input" name="topics[]" value="c359fa76-88ff-4298-817e-5cf974473853" tabindex="-1">
                                <label for="topic-c359fa76-88ff-4298-817e-5cf974473853" class="govuk-label govuk-checkboxes__label">
                                Data collection for looked-after children
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-50904cbc-3cde-4a3b-92ba-b75117671574" class="govuk-checkboxes__input" name="topics[]" value="50904cbc-3cde-4a3b-92ba-b75117671574" tabindex="-1">
                                <label for="topic-50904cbc-3cde-4a3b-92ba-b75117671574" class="govuk-label govuk-checkboxes__label">
                                Children's homes and other accommodation
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-d5c3d032-2c12-4bb3-8340-3cc5084ccba7" class="govuk-checkboxes__input" name="topics[]" value="d5c3d032-2c12-4bb3-8340-3cc5084ccba7" tabindex="-1">
                                <label for="topic-d5c3d032-2c12-4bb3-8340-3cc5084ccba7" class="govuk-label govuk-checkboxes__label">
                                Children and young people leaving care
                                </label>
                             </div>
                          </li>
                       </ul>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-454b3d57-870e-4691-a700-abbf7d883c34" class="govuk-checkboxes__input" name="topics[]" value="454b3d57-870e-4691-a700-abbf7d883c34" tabindex="-1">
                          <label for="topic-454b3d57-870e-4691-a700-abbf7d883c34" class="govuk-label govuk-checkboxes__label">
                          Children's social care providers
                          </label>
                       </div>
                       <ul>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-45a65707-11c7-4e58-88b7-164f83d073e6" class="govuk-checkboxes__input" name="topics[]" value="45a65707-11c7-4e58-88b7-164f83d073e6" tabindex="-1">
                                <label for="topic-45a65707-11c7-4e58-88b7-164f83d073e6" class="govuk-label govuk-checkboxes__label">
                                Becoming a children's social care provider
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-49043bab-0075-414b-969b-b144539eef05" class="govuk-checkboxes__input" name="topics[]" value="49043bab-0075-414b-969b-b144539eef05" tabindex="-1">
                                <label for="topic-49043bab-0075-414b-969b-b144539eef05" class="govuk-label govuk-checkboxes__label">
                                Social care provider complaints
                                </label>
                             </div>
                          </li>
                          <li>
                             <div class="govuk-checkboxes__item">
                                <input type="checkbox" id="topic-689bb0dd-bd50-42e0-9195-cfb020bc3ee7" class="govuk-checkboxes__input" name="topics[]" value="689bb0dd-bd50-42e0-9195-cfb020bc3ee7" tabindex="-1">
                                <label for="topic-689bb0dd-bd50-42e0-9195-cfb020bc3ee7" class="govuk-label govuk-checkboxes__label">
                                Inspection of children's social care providers
                                </label>
                             </div>
                             <ul>
                                <li>
                                   <div class="govuk-checkboxes__item">
                                      <input type="checkbox" id="topic-4def8626-632e-4aeb-bc18-e5201e0faf65" class="govuk-checkboxes__input" name="topics[]" value="4def8626-632e-4aeb-bc18-e5201e0faf65" tabindex="-1">
                                      <label for="topic-4def8626-632e-4aeb-bc18-e5201e0faf65" class="govuk-label govuk-checkboxes__label">
                                      Inspections of fostering and adoption agencies
                                      </label>
                                   </div>
                                </li>
                                <li>
                                   <div class="govuk-checkboxes__item">
                                      <input type="checkbox" id="topic-26b5cfbd-1677-4629-8674-223b67b480c7" class="govuk-checkboxes__input" name="topics[]" value="26b5cfbd-1677-4629-8674-223b67b480c7" tabindex="-1">
                                      <label for="topic-26b5cfbd-1677-4629-8674-223b67b480c7" class="govuk-label govuk-checkboxes__label">
                                      Inspections of local authority children's services
                                      </label>
                                   </div>
                                </li>
                                <li>
                                   <div class="govuk-checkboxes__item">
                                      <input type="checkbox" id="topic-d6ecea97-16a9-485b-ad56-fa9c2dc75df7" class="govuk-checkboxes__input" name="topics[]" value="d6ecea97-16a9-485b-ad56-fa9c2dc75df7" tabindex="-1">
                                      <label for="topic-d6ecea97-16a9-485b-ad56-fa9c2dc75df7" class="govuk-label govuk-checkboxes__label">
                                      Children's homes and other residential care inspections
                                      </label>
                                   </div>
                                </li>
                                <li>
                                   <div class="govuk-checkboxes__item">
                                      <input type="checkbox" id="topic-ed77b584-f8b0-4e9e-9027-ed3aadd9feac" class="govuk-checkboxes__input" name="topics[]" value="ed77b584-f8b0-4e9e-9027-ed3aadd9feac" tabindex="-1">
                                      <label for="topic-ed77b584-f8b0-4e9e-9027-ed3aadd9feac" class="govuk-label govuk-checkboxes__label">
                                      Incidents, concerns and feedback about children's social care providers
                                      </label>
                                   </div>
                                </li>
                             </ul>
                          </li>
                       </ul>
                    </li>
                 </ul>
              </li>
           </ul>
        </li>
        </ul>
        </govuk-miller-columns>
        <govuk-breadcrumbs id="selected-items" for="miller-columns"></govuk-breadcrumbs>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = undefined
    })

    it('unnest lists', function() {
      const lists = document.querySelectorAll('ul')
      assert.equal(lists.length, 15)
    })

    it('store tree depth', function() {
      const millerColumns = document.querySelector('govuk-miller-columns')
      assert.equal(millerColumns.getAttribute('data-depth'), '5')
    })

    it('store list levels', function() {
      const l1Lists = document.querySelectorAll('ul[data-level="1"]')
      assert.equal(l1Lists.length, 1)

      const l2Lists = document.querySelectorAll('ul[data-level="2"]')
      assert.equal(l2Lists.length, 1)

      const l3Lists = document.querySelectorAll('ul[data-level="3"]')
      assert.equal(l3Lists.length, 7)

      const l4Lists = document.querySelectorAll('ul[data-level="4"]')
      assert.equal(l4Lists.length, 5)

      const l5Lists = document.querySelectorAll('ul[data-level="5"]')
      assert.equal(l5Lists.length, 1)
    })

    it('mark items with children as parents', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      assert.equal(firstItem.getAttribute('data-parent'), 'true')
    })

    it('store state for active items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      firstItem.click()
      assert.equal(firstItem.getAttribute('data-selected'), 'true')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('show the child list for active list items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      const l2List = document.querySelector('ul[data-level="2"]')
      firstItem.click()
      assert.equal(l2List.getAttribute('data-collapse'), 'false')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('unselect children when item is unselected', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      firstItemL1.click()
      firstItemL2.click()
      firstItemL1.click()

      assert.equal(firstItemL2.dataset.selected, 'false')
    })

    it('store active items in breadcrumb', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstLabelL1 = document.querySelector('ul[data-level="1"] li label')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      const firstLabelL2 = document.querySelector('ul[data-level="2"] li label')
      firstItemL1.click()
      firstItemL2.click()
      const breadcrumbsL1 = document.querySelector('#selected-items ol li:nth-child(1)')
      const breadcrumbsL2 = document.querySelector('#selected-items ol li:nth-child(2)')
      assert.equal(breadcrumbsL1.innerHTML.trim(), firstLabelL1.innerHTML.trim())
      assert.equal(breadcrumbsL2.innerHTML.trim(), firstLabelL2.innerHTML.trim())

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('removes a chain from stored breadcrumbs', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li:nth-child(1)')

      firstItemL1.click()

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()

      const breadcrumbs = document.querySelectorAll('#selected-items ol')
      assert.equal(breadcrumbs.length, 0)
    })

    it('use checkboxes to illustrate selection', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li:nth-child(1)')

      firstItemL1.click()

      const firstCheckbox = document.querySelector('ul[data-level="1"] li:nth-child(1) input[type=checkbox]')
      assert.equal(firstCheckbox.getAttribute('checked'), 'checked')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('creates a new chain when selecting siblings', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li:nth-child(1)')
      const secondItemL2 = document.querySelector('ul[data-level="2"] li:nth-child(2)')

      const firstLabelL1 = document.querySelector('ul[data-level="1"] li label')
      const firstLabelL2 = document.querySelector('ul[data-level="2"] li:nth-child(1) label')
      const secondLabelL2 = document.querySelector('ul[data-level="2"] li:nth-child(2) label')

      firstItemL1.click()
      firstItemL2.click()
      secondItemL2.click()

      const firstBreadcrumbsL1 = document.querySelector('#selected-items ol:nth-child(1) li:nth-child(1)')
      const firstBreadcrumbsL2 = document.querySelector('#selected-items ol:nth-child(1) li:nth-child(2)')
      const secondBreadcrumbsL1 = document.querySelector('#selected-items ol:nth-child(2) li:nth-child(1)')

      assert.equal(firstBreadcrumbsL1.innerHTML.trim(), firstLabelL1.innerHTML.trim())
      assert.equal(firstBreadcrumbsL2.innerHTML.trim(), firstLabelL2.innerHTML.trim())
      assert.equal(secondBreadcrumbsL1.innerHTML.trim(), secondLabelL2.innerHTML.trim())

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()

      const secondBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      secondBreadcrumbsRemove.click()
    })
  })
})
