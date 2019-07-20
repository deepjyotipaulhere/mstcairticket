<template>
	<Page>
		<ActionBar title="Approve Requests">
		</ActionBar>
		<StackLayout style="padding:30px;">
			<Label fontSize="26" marginBottom="20"><Span>Ticket ID: </Span><Span fontWeight="bold">{{id}}</Span></Label>/>
			<GridLayout columns="*,*" rows="50,50,50,50,50,50,50,30,auto,80">
				<Label text="Requested by" col="0" row="0"/>
				<Label :text="details.Requestor_name" row="0" col="1"/>
				<Label text="Departing From" col="0" row="1"/>
				<Label :text="details.Departure_Frm" row="1" col="1"/>
				<Label text="Arriving To" row="2" col="0"/>
				<Label :text="details.Departure_To" row="2" col="1"/>
				<Label text="Departure Date" row="3" col="0"/>
				<Label :text="details.Departure_Date" row="3" col="1"/>
				<Label text="Return Date" row="4" col="0"/>
				<Label :text="details.Return_Date" row="4" col="1"/>
				<Label text="Remarks" row="5" col="0"/>
				<Label :text="details.Remarks" row="5" col="1" />
				<Label text="Request Date" row="6" col="0"/>
				<Label :text="details.Request_Date" row="6" col="1"/>
				<Label text="Comments" row="7" col="0"/>
				<TextView
					text
					editable="true"
					hint="Enter comments..."
					padding="20"
					backgroundColor="#efefef"
					v-model="remarks"
					row="8"
					col="0"
					colSpan="2" 
					autofocus
					v-if="details.Approver_Status!='Approved'"
				/>
				<Button
					@tap="reject"
					text="Reject"
					class="btn btn-primary"
					backgroundColor="red"
					margin="25px"
					padding="5"
					row="9" col="0"
					v-if="details.Approver_Status!='Approved'"
				/>
				<Button
					@tap="approve"
					text="Approve"
					class="btn btn-primary"
					backgroundColor="green"
					margin="25px"
					padding="5"
					row="9" col="1"
					v-if="details.Approver_Status!='Approved'"
				/>
			</GridLayout>
		</StackLayout>
	</Page>
</template>

<script>
import axios from "axios";
export default {
	data() {
		return {
			details: {},
			remarks:''
		};
	},
	props: ["id"],
	created() {
		axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/GetAirTicketDetails/" +
			localStorage.getItem("empcode") + "/" +
			this.id
		).then(response => {
			this.details = response.data.GetAirTicketDetailsResult;
		});
	},
	methods:{
		approve(){
			axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/ApproveAirTicketRequest/"+localStorage.getItem("empcode")+"/1/"+this.id+"/"+this.remarks).then(response=>{
				this.$modal.close()
			})
		},
		reject(){
			axios.get("http://220.225.138.75/MSTCInternalServices/MSTCServices.svc/ApproveAirTicketRequest/"+localStorage.getItem("empcode")+"/0/"+this.id+"/"+this.remarks).then(response=>{
				this.$modal.close()
			})
		}
	}
};
</script>

<style>
</style>
