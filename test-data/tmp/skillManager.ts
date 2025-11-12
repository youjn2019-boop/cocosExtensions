
import { skill, skillArray } from "./skill";
import { tableManager } from "./tableManager";

export class skillManager extends tableManager {

    mItemArray: skillArray;
	/// <summary>
	/// give the key(s) to get item.
	/// </summary>
	/// <param name="id">编号</param> 
    GetItem(id: number): skill {
		var key = id; //((id) << 0)
		var index = this.search(key);
		return -1 === index ? null : this.mItemArray.Items[index];
    }
	
	GetAllItem(): skillArray {
		return this.mItemArray;
	}

    protected getTableKeys(): Array<number> {
        return this.mItemArray.Keys;
    }
}
