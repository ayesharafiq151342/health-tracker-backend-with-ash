import mealModel from '../models/mealsModel.js';



export const Meal = async (req, res) => {
    try {
        const meals = await mealModel.find({ user: req.body.userId });
        if(!meals.length)
        {
            return res.json({ success: true, meals: [] });
        }

        res.json({ success: true, meals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createMeal = async(req, res)=>
    {
        const { userId,category, calories, carbs, fats, protiens, sodium, sugar, fiber ,date} = req.body ;
       
        if(!category || !calories || !carbs || !fats || !protiens || !sodium || !sugar || !fiber || !date)
        {
            return res.json({success: false, message:'Fields are empty'})
        }
        try 
        {
            const isPresent = await mealModel.findOne({userId});
            if(isPresent)
            {
                return res.json({success: false, message: 'Today data already exist'})
            }
    
            const enterData = new mealModel({user: userId,category, calories, carbs, fats, protiens, sodium, sugar, fiber, date});
            await enterData.save();
            return res.json({success: true, message: 'Data Added Successfully'})
            
        }
        catch(error)
        {
            return res.json({success: false, message:error.message});
        }
    
    }
    
    export const editMeal = async(req, res)=>
    {
        const {id} = req.params;
        console.log(id)
        const { category, calories, carbs, fats, protiens, sodium, sugar, fiber, userId, date} = req.body ;
        if(!category || !calories || !carbs || !fats || !protiens || !sodium || !sugar || !fiber || !date)
            {
                return res.json({success: false, message:'Fields are empty'})
            }
        try 
        {
            const isPresent = await mealModel.findOne({user: userId});
            if(!isPresent)
            {
                return res.json({success: false, message: 'Today data are not exist'})
            }
            const filter = { user: userId};
            
            const update = {
                category, calories, carbs, fats, protiens, sodium, sugar, fiber, date
            }
            const editData = await mealModel.findOneAndUpdate(filter, update);
            if(!editData)
            {
                console.log("Nothing")
            }
            await editData.save()
          
            console.log("Data updated")
            return res.json({success: true, message: 'Data Updated Successfully'})
    
        }
        catch(error)
        {
            return res.json({success: false, message:error.message});
        }
    }
    
    export const deleteMeal =  async (req, res) => {
        try {
          const mealId = req.params.id;
      
        
          const deletedMeal = await mealModel.findByIdAndDelete(mealId);
          
          if (!deletedMeal) {
            return res.status(404).json({ success: false, message: "Meal not found" });
          }
      
          res.json({ success: true, message: "Meal deleted successfully" });
        } catch (error) {
          console.error("Error deleting meal:", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      
    }

