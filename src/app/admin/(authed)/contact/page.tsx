import { getContent } from "@/lib/content";
import { PageHeader, Btn, Field } from "@/components/admin/Toolbar";
import { saveSiteText } from "../content/actions";
import { waLink } from "@/lib/utils";

export default async function ContactSettings() {
  const { contact } = await getContent();
  const preview = contact.whatsapp_number ? waLink(contact.whatsapp_number, contact.whatsapp_message) : null;
  return (
    <>
      <PageHeader title="Contact Settings" subtitle="WhatsApp, email and intro copy for the contact page." />
      <form action={saveSiteText} className="space-y-5 border hairline p-6 max-w-2xl">
        <input type="hidden" name="__key" value="contact" />
        <Field label="Heading" name="heading" defaultValue={contact.heading} />
        <Field label="Intro" name="intro" defaultValue={contact.intro} textarea rows={3} />
        <Field label="Email" name="email" type="email" defaultValue={contact.email} />
        <Field label="WhatsApp number (digits, with country code)" name="whatsapp_number" defaultValue={contact.whatsapp_number} placeholder="e.g. 212600112233" hint="No +, spaces or dashes." />
        <Field label="WhatsApp prefilled message" name="whatsapp_message" defaultValue={contact.whatsapp_message} textarea rows={2} />
        {preview && (
          <div className="text-[11px] text-white/50 break-all">
            Preview: <a href={preview} className="underline hover:text-white" target="_blank" rel="noopener noreferrer">{preview}</a>
          </div>
        )}
        <Btn type="submit" variant="solid">Save contact</Btn>
      </form>
    </>
  );
}
