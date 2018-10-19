package com.zbwb.mengxi.module.emergency;


import com.zbwb.mengxi.common.anno.Model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "emergency_plan")
@Model(title = "应急预案管理")
public class EmergencyPlan extends RetractableResource {


}
