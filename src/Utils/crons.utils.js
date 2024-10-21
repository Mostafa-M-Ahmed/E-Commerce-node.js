import { scheduleJob } from 'node-schedule'
import { Coupon } from '../../DB/Models';
import { DateTime } from 'luxon';


export const disableCouponsCron = () => {
    scheduleJob('0 59 23 * * *', async () => {
        console.log('Cron job to disable expired coupons every day');
        const enabledCoupons = await Coupon.find({ isEnabled: true });

        if (enabledCoupons.length) {
            for (const coupon of enabledCoupons) {
                if (DateTime.now() > DateTime.fromJSDate(enabledCoupons[0].till) {
                    coupon.isEnabled = false;
                    await coupon.save();
                }
            }
        }
    })
}