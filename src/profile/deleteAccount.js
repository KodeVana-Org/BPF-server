const User = require('../models/user.Model');

// Variable to track scheduled deletion
let deletionScheduled = false;

exports.DeleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;

        // If deletion is already scheduled, return a message indicating that deletion is already scheduled
        if (deletionScheduled) {
            return res.status(400).json({
                success: false,
                message: 'Deletion is already scheduled.'
            });
        }

        // Find user and update status to "deleting"
        await User.findByIdAndUpdate(userId, { status: 'deleting' });

        // Schedule deletion
        deletionScheduled = true;
        setTimeout(async () => {
            // Check if deletion is still scheduled
            if (deletionScheduled) {
                // Delete user account
                const deletedUser = await User.findByIdAndDelete(userId);
                if (!deletedUser) {
                    return res.status(404).json({
                        success: false,
                        message: `User with ID ${userId} not found.`
                    });
                }
                // Respond after successful deletion
                return res.status(200).json({
                    success: true,
                    message: `User with ID ${userId} deleted after 12 hours.`
                });
            }
        }, twelveHoursInMilliseconds);
        
        // Respond with success message indicating that deletion is scheduled
        return res.status(200).json({
            success: true,
            message: `Account deletion scheduled.`
        });
    } catch (error) {
        console.error(`Error while deleting user account: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Error while deleting user account.'
        });
    }
};

exports.CancelDeletion = async (req, res) => {
    try {
        const userId = req.user.id;

        // Cancel scheduled deletion
        deletionScheduled = false;

        // Find user and update status to "active"
        await User.findByIdAndUpdate(userId, { status: 'active' });

        return res.status(200).json({
            success: true,
            message: `Scheduled deletion cancelled.`
        });
    } catch (error) {
        console.error(`Error while cancelling scheduled deletion: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Error while cancelling scheduled deletion.'
        });
    }
};
