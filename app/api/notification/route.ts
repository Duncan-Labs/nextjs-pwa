const webPush = require('web-push');

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

export const POST = async (req: Request, res: Response) => {
  console.log('HIT BACKEND');

  if (req.method !== 'POST') {
    return new Response(null, {
      status: 405,
    });
  }

  const body = await req.json();

  const { subscription } = body;

  try {
    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: '$5 Gift Card',
        message: 'Participate in this survey for a $5 gift card!',
      })
    );

    return new Response(response.body, {
      status: response.statusCode,
      headers: response.headers,
    });
  } catch (err: any) {
    console.error('ERROR SENDING NOTIFICATION');
    if ('statusCode' in err) {
      return new Response(err.body, {
        status: 500,
        headers: err.headers,
      });
    } else {
      console.error(err);
      return new Response(null, {
        status: 500,
      });
    }
  }
};
