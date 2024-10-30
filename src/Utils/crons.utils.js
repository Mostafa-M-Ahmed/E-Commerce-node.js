import { scheduleJob } from 'node-schedule'
import { Coupon, CouponChangeLog } from '../../DB/Models/index.js';
import { DateTime } from 'luxon';


export const disableCouponsCron = () => {
    scheduleJob('*/10 * * * * *', async () => {
        // console.log('Cron job to disable expired coupons every day');
        const enabledCoupons = await Coupon.find({ isEnabled: true });

        if (enabledCoupons.length) {
            for (const coupon of enabledCoupons) {
                if (DateTime.now() > DateTime.fromJSDate(enabledCoupons[0].till)) {
                    coupon.isEnabled = false;
                    console.log("An expired coupon was found and set to false");
                    await coupon.save();
                }
            }
        }
    })
}