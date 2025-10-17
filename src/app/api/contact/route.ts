// FILE: src/app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, ...formData } = body;

    // Validar que el email sea obligatorio
    if (!formData.email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    // Generar el contenido del email según el tipo
    const emailContent = generateEmailContent(subject, formData);

    // Enviar email con Resend
    const data = await resend.emails.send({
      from: 'Secret Network <contacto@secretnetwork.co>',
      to: ['01studiobinary@gmail.com'],
      replyTo: formData.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor, intentá de nuevo.' },
      { status: 500 }
    );
  }
}

function generateEmailContent(
  subject: string,
  formData: any
): { subject: string; html: string } {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
      .header { background: linear-gradient(135deg, #ff3399 0%, #ff3399bb 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px; background-color: #f9f9f9; }
      .field { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #ff3399; }
      .label { font-weight: bold; color: #ff3399; text-transform: uppercase; font-size: 12px; margin-bottom: 5px; }
      .value { color: #333; font-size: 14px; }
      .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
      .badge { display: inline-block; padding: 4px 8px; background-color: #ff3399; color: white; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    </style>
  `;

  switch (subject) {
    case 'sponsor':
      return {
        subject: `Nueva Propuesta de Sponsor - ${formData.company}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Nueva Propuesta de Sponsor</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Empresa</div>
                <div class="value">${formData.company}</div>
              </div>
              <div class="field">
                <div class="label">Contacto</div>
                <div class="value">${formData.name} - ${formData.email}</div>
              </div>
              ${formData.website ? `
                <div class="field">
                  <div class="label">Website</div>
                  <div class="value"><a href="${formData.website}" target="_blank">${formData.website}</a></div>
                </div>
              ` : ''}
              <div class="field">
                <div class="label">Tipo de Sponsoreo</div>
                <div class="value"><span class="badge">${formData.sponsorType}</span></div>
              </div>
              <div class="field">
                <div class="label">Presupuesto Estimado</div>
                <div class="value"><strong>USD $${formData.budget}</strong></div>
              </div>
              <div class="field">
                <div class="label">Mensaje</div>
                <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              Secret Network - Directorio de Herramientas de Diseño
            </div>
          </div>
        `,
      };

    case 'error':
      return {
        subject: `Reporte de Error - ${formData.errorType}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Nuevo Reporte de Error</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Tipo de Error</div>
                <div class="value"><span class="badge">${formData.errorType}</span></div>
              </div>
              <div class="field">
                <div class="label">URL del Error</div>
                <div class="value"><a href="${formData.pageUrl}" target="_blank">${formData.pageUrl}</a></div>
              </div>
              <div class="field">
                <div class="label">Reportado por</div>
                <div class="value">${formData.name || 'Anónimo'} - ${formData.email}</div>
              </div>
              ${formData.browser ? `
                <div class="field">
                  <div class="label">Navegador</div>
                  <div class="value">${formData.browser}</div>
                </div>
              ` : ''}
              <div class="field">
                <div class="label">Descripción</div>
                <div class="value">${formData.description.replace(/\n/g, '<br>')}</div>
              </div>
              ${formData.stepsToReproduce ? `
                <div class="field">
                  <div class="label">Pasos para Reproducir</div>
                  <div class="value">${formData.stepsToReproduce.replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              Secret Network - Directorio de Herramientas de Diseño
            </div>
          </div>
        `,
      };

    case 'program':
      return {
        subject: `Nueva Sugerencia de Programa - ${formData.programName}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Nueva Sugerencia de Programa</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Programa</div>
                <div class="value"><strong>${formData.programName}</strong></div>
              </div>
              <div class="field">
                <div class="label">Website Oficial</div>
                <div class="value"><a href="${formData.programWebsite}" target="_blank">${formData.programWebsite}</a></div>
              </div>
              <div class="field">
                <div class="label">Categoría</div>
                <div class="value"><span class="badge">${formData.category}</span></div>
              </div>
              <div class="field">
                <div class="label">¿Es Open Source?</div>
                <div class="value">${formData.isOpenSource === 'yes' ? 'Sí' : formData.isOpenSource === 'freemium' ? 'Freemium' : 'No'}</div>
              </div>
              <div class="field">
                <div class="label">Sugerido por</div>
                <div class="value">${formData.name || 'Anónimo'} - ${formData.email}</div>
              </div>
              <div class="field">
                <div class="label">Descripción</div>
                <div class="value">${formData.description.replace(/\n/g, '<br>')}</div>
              </div>
              ${formData.whyAdd ? `
                <div class="field">
                  <div class="label">¿Por qué agregarlo?</div>
                  <div class="value">${formData.whyAdd.replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              Secret Network - Directorio de Herramientas de Diseño
            </div>
          </div>
        `,
      };

    case 'general':
    default:
      return {
        subject: `Nuevo Mensaje de Contacto - ${formData.name}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Nuevo Mensaje de Contacto</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Mensaje</div>
                <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              Secret Network - Directorio de Herramientas de Diseño
            </div>
          </div>
        `,
      };
  }
}
