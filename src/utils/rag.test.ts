import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, computeScore, matchService, retrieveGovKnowledge, buildGroundedPrompt } from './ragEngine.ts';
import { OFFICIAL_SERVICES } from '../data/servicesData.ts';

test('tokenize cleanly splits Devanagari and English words', () => {
  const tokens = tokenize('मुझे आय प्रमाण पत्र बनवाना है, documents required?');
  assert.ok(tokens.includes('प्रमाण'));
  assert.ok(tokens.includes('income') === false);
  assert.ok(tokens.includes('documents'));
  assert.ok(tokens.includes('required'));
});

test('matchService accurately matches income certificate query', () => {
  const query = 'मुझे आय प्रमाण पत्र बनवाना है। इसके लिए कौन-कौन से दस्तावेज चाहिए?';
  const service = matchService(query, OFFICIAL_SERVICES);
  assert.ok(service !== undefined);
  assert.equal(service?.id, 'income-cert');
  assert.equal(service?.timelineDays, 15);
  assert.ok(service?.requiredDocuments.length > 0);
});

test('matchService matches caste certificate query in English', () => {
  const query = 'What documents are required for a caste certificate in Uttarakhand?';
  const service = matchService(query, OFFICIAL_SERVICES);
  assert.ok(service !== undefined);
  assert.equal(service?.id, 'caste-cert');
});

test('matchService matches farmer welfare query', () => {
  const query = 'किसान भाइयों के लिए पॉलीहाउस और पीएम किसान योजना क्या है?';
  const service = matchService(query, OFFICIAL_SERVICES);
  assert.ok(service !== undefined);
  assert.equal(service?.id, 'farmer-schemes');
});

test('retrieveGovKnowledge extracts verified chunks and sources', () => {
  const res = retrieveGovKnowledge('वृद्धावस्था पेंशन कितनी मिलती है?');
  assert.ok(res.chunks.length > 0);
  assert.ok(res.matchedService?.id === 'old-age-pension');
  assert.ok(res.sources.length > 0);
  assert.ok(res.sources.some(s => s.isVerified));
});

test('buildGroundedPrompt produces system instructions and user prompt', () => {
  const retrieved = retrieveGovKnowledge('आय प्रमाण पत्र दस्तावेज');
  const prompt = buildGroundedPrompt('आय प्रमाण पत्र दस्तावेज', 'hi', retrieved);
  assert.ok(prompt.systemInstruction.includes('पहाड़ी सेवावाणी'));
  assert.ok(prompt.userPrompt.includes('आय प्रमाण पत्र'));
});

test('retrieveGovKnowledge flags low confidence and returns eservices redirect for out-of-scope query', () => {
  const res = retrieveGovKnowledge('how to bake a chocolate cake recipe or play guitar');
  assert.equal(res.isLowConfidence, true);
  assert.ok(res.confidenceScore < 0.65);
  assert.ok(res.directOfficialUrl.includes('eservices.uk.gov.in'));
});

test('retrieveGovKnowledge grants high confidence and eservices link for official revenue services', () => {
  const res = retrieveGovKnowledge('पर्वतीय क्षेत्र प्रमाण पत्र हिल एरिया सर्टिफिकेट कैसे बनेगा?');
  assert.equal(res.isLowConfidence, false);
  assert.ok(res.confidenceScore >= 0.65);
  assert.equal(res.matchedService?.id, 'hill-area-cert');
  assert.equal(res.matchedService?.officialPortalUrl, 'https://eservices.uk.gov.in');
});

